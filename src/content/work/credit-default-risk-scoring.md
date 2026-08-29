---
title: "Credit Default Scoring — picking the metric before the model"
deck: "The model I selected is the one that scored worse on accuracy. Accuracy was the wrong question."
order: 2
metrics:
  - value: "0.86"
    label: "AUC-ROC, validation"
  - value: "150,000"
    label: "Training records"
  - value: "14:1"
    label: "Class imbalance"
  - value: "6.7%"
    label: "Default rate"
---

## Problem

Estimate the probability that a loan applicant becomes seriously delinquent —
90 days or more past due — within a two-year horizon. Master's thesis, built on
the public Give Me Some Credit dataset. The interesting constraint is not the
model, it is the cost asymmetry: a missed defaulter costs the lender the
principal, a false positive costs a rejected application.

## Data

150,000 labelled applications, 11 features: age, monthly income, debt ratio,
number of credit lines and mortgages, dependants, and three columns counting
past delays at 30–59, 60–89 and 90+ days. 6.7% positive, a ratio of roughly
14:1. Income missing in about 20% of rows; the delay columns carry the sentinel
values 96 and 98; debt ratio reaches 300,000 in places.

## Decisions

- Accuracy was discarded as the selection metric before any model was trained.
  A model that always predicts "no default" scores 93.3% on this data and has
  learned nothing. Selection ran on F-beta with β=2, which weights recall four
  times precision — the direction the cost asymmetry actually points.
- Treated 96 and 98 in the delay columns as coding artifacts rather than
  observations, and replaced them with the observed maximum instead of dropping
  the rows. Those rows are not noise; they are applicants with bad histories,
  which is the class the model exists to find.
- Imputation statistics computed on the training split only.
- Handled the imbalance with `scale_pos_weight` rather than SMOTE. Synthesising
  minority rows means interpolating between rare events that are rare for
  reasons the interpolation does not know about.
- Seven engineered features, including monthly debt burden as an absolute
  amount rather than a ratio. SHAP later ranked it fifth of eighteen, which is
  the only reason I know the feature engineering earned its place.
- SHAP TreeExplainer for per-application attribution. A rejection a lender
  cannot explain to the applicant is not deployable, whatever it scores.

## Result

LightGBM at AUC-ROC 0.86 on validation, F₂ 0.513 against XGBoost's 0.504.
XGBoost was 1.6 points more accurate on the test split and I selected LightGBM
anyway, because accuracy was not the criterion. Utilisation of revolving credit
and the 30–59 day delay count dominate the SHAP attributions; age pushes risk
down.

## What I'd do differently

- Tune the classification threshold. Optimising for F₂ while scoring at the
  default 0.5 cut-off contradicts the entire argument — the threshold is where
  cost asymmetry gets expressed, and I never touched it. This is the largest
  defect in the project.
- Fit the Box-Cox lambda on the training set alone. I fitted it on train and
  test jointly. The effect is small; the principle is the one I spend the other
  case complaining about.
- Derive `scale_pos_weight` from the actual 14:1 ratio or tune it. I set it to
  10 by hand, which is neither.
- Stop selecting on a 0.009 gap from a single split. That margin is inside the
  noise; repeated cross-validation or a paired comparison would make the choice
  a choice rather than a coin flip.
- Report PR-AUC next to ROC-AUC. At 6.7% positives, ROC-AUC is generous.