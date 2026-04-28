FEATURE_NAMES = ["gender_encoded", "experience", "score"]


def get_feature_importance(model, features):
    """Approximate feature contribution using logistic regression coefficients."""
    coefficients = model.coef_[0]
    contributions = {
        name: float(coefficients[index] * features[index])
        for index, name in enumerate(FEATURE_NAMES)
    }
    return contributions


def explain_decision(model, features, prediction):
    """Generate a beginner-friendly explanation and feature importance summary."""
    contributions = get_feature_importance(model, features)
    experience_contribution = contributions["experience"]
    score_contribution = contributions["score"]
    ranking = {
        "experience": abs(experience_contribution),
        "score": abs(score_contribution),
    }
    dominant_feature = max(ranking, key=ranking.get)

    if prediction == 1:
        if dominant_feature == "experience":
            explanation = "The candidate is likely selected because experience is a strong positive factor."
        elif features[2] >= 80:
            explanation = "The candidate is likely selected because the test score is strong."
        else:
            explanation = "The candidate is likely selected because the profile looks balanced overall."
    else:
        if features[1] < 3:
            explanation = "The candidate is likely rejected because experience is below the stronger applicants."
        elif features[2] < 60:
            explanation = "The candidate is likely rejected because the test score is relatively low."
        else:
            explanation = "The candidate is likely rejected because other applicants appear stronger on key factors."

    feature_importance = {
        "experience": round(abs(experience_contribution), 4),
        "score": round(abs(score_contribution), 4),
    }

    return explanation, feature_importance
