---
title: "Customer Subscription Prediction — the model I threw away"
deck: "A model scored AUC 0.90. The result of the project is the explanation of why that number was worthless."
eyebrow: "Case / academic"
order: 1
draft: false
repo: "https://github.com/TristanLacruz/Customer-Behaviour-ML-Analysis"
metrics:
  - value: "0.90"
    label: "AUC with leakage"
    retracted: true
  - value: "0.501"
    label: "AUC clean, 5-fold"
  - value: "± 0.018"
    label: "Std dev across folds"
  - value: "4,000"
    label: "Records"
---

## Problem

Predict which customers hold a subscription, from shopping behaviour alone, so
marketing can target the rest. The first model scored AUC 0.90. The result of
the project is the explanation of why that number was worthless.

## Data

4,000 customer records, 11 features: age, gender, category, purchase amount,
review rating, shipping type, discount flag, previous purchases, purchase
frequency. Target `subscription_status`, 27% positive. Public, synthetic
dataset.

## Decisions

- Before trusting the score, I checked the strongest predictors against the
  label as contingency tables rather than correlations. Two failed.
  `discount_applied` tracks subscription status by policy, so it is a
  consequence of the label, not a cause. `gender` separated the classes almost
  perfectly, with no woman in the dataset subscribing at all. Both dropped.
- Kept the leaky run as the comparison instead of deleting it, so the size of
  the inflation stays visible.
- Judged the clean model on 5-fold cross-validation, not on the single split: at
  n=4,000 one split cannot distinguish 0.45 from 0.55.
- RandomForest throughout. The open question was whether signal existed at all,
  not which estimator extracts it best.
- Separately, SQL (CTEs, `ROW_NUMBER`, subqueries) and a Power BI dashboard for
  the descriptive side: 27% subscription rate, $59.76 average ticket, 3.75
  average rating.

## Result

Clean AUC 0.501 ± 0.018 across five folds — chance. Predicted-probability
distributions overlap completely between classes, and the numeric features
dominate the tree splits while separating nothing. The leak was worth roughly
+0.40 AUC of pure fiction.

The conclusion is that shopping behaviour does not predict subscription here,
because the label was generated independently of the behavioural columns.
Reporting that, rather than shipping the 0.90, is the deliverable.

## What I'd do differently

- Run the leakage audit first, not after a suspiciously good score.
- Cross-validate the leaky model too, so both numbers come from one protocol.
- Ablate the two leaks separately, to attribute the inflation to each.
- Drop the business recommendations I wrote. Advising a client to audit their
  discount policy on the basis of a fabricated dataset is the exact error the
  rest of the project is about.