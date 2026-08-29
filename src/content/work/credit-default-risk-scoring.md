---
title: "Credit Default Risk Scoring — LightGBM vs XGBoost"
deck: "Predicting 90-day delinquency under 14:1 class imbalance, selecting on F-beta rather than accuracy."
eyebrow: "Case / academic — not deployed"
order: 2
draft: true
repo: "https://github.com/TristanLacruz/Loan-Default-Risk-Prediction-with-Machine-Learning"
metrics:
  - value: "0.86"
    label: "AUC-ROC, validation"
  - value: "51.32"
    label: "F-beta β=2"
  - value: "150,000"
    label: "Training rows"
  - value: "14:1"
    label: "Class imbalance"
---

## Problem

Lenders need a per-applicant probability of serious delinquency (90+ days late),
under asymmetric cost: a missed defaulter loses the loan, a false alarm loses a
customer. The score also has to be explainable enough to audit. Built as my
Master's thesis. Academic, never deployed.

## Data

Kaggle's Give Me Some Credit: 150,000 labelled applications, 11 features, 6.7%
positives (roughly 14:1). That rules out accuracy as a metric, since always
predicting "no default" scores 93%. Three defects in the raw data: sentinel
values 96 and 98 in the delinquency columns, debt ratios up to 300,000, and
19.8% missing income. I mapped the sentinels to the observed maximum, dropped
the extreme rows, and imputed income with the median, computed on the training
split only.

## Decisions

- F-beta (β=2) rather than AUC as the selection metric: recall on defaulters
  matters more than precision here.
- `scale_pos_weight=10` instead of SMOTE. No synthetic applicants in a regulated
  context, and boosting reweights natively.
- 7 engineered features, mostly ratios turning absolutes into per-household
  terms (income per dependant, absolute monthly debt), plus flags for retirement
  age and mortgage concentration.
- Box-Cox (λ=0.15) against skew.
- Both models tuned identically: RandomizedSearchCV, cv=5, 70/30 split,
  `random_state=2020` fixed end to end.

## Result

LightGBM reached AUC-ROC 0.86 on validation and F-beta(β=2) 51.32, against
XGBoost's 50.39. XGBoost was the more accurate model (87.2% vs 85.6%) and I
picked LightGBM anyway, because accuracy is the wrong metric at 14:1. SHAP
(TreeExplainer) ranked revolving credit utilisation, 30–59 day delinquencies and
age highest; my engineered monthly-debt feature came fifth.

## What I'd do differently

- Fit Box-Cox on the training fold only. I fitted λ on train and test jointly,
  which leaks distribution information. Small effect here, indefensible in
  production.
- Derive `scale_pos_weight` from the real ratio (~14) instead of a hand-picked
  10.
- Price the threshold against an explicit cost matrix rather than leaving it at
  0.5. I argued asymmetric cost via β=2 and then never quantified it.
- Drop MSE, RMSE and MAE. They are regression metrics that only restate the
  error rate on a classifier.