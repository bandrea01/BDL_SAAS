import random
import numpy as np


def generate_temperature_values(n, std_dev, avg, outlier_probability):
    """
    Generate temperature values with normal distribution and occasional outliers.

    Args:
        n (int): Number of temperature values to generate.
        std_dev (float): Standard deviation of the normal distribution.
        avg (float): Average
        outlier_probability (float): Probability of generating an outlier (0 to 1).

    Returns:
        List[float]: List of temperature values.
    """
    temperatures = []
    actual_outlier_probability = outlier_probability
    for i in range(0, n):
        if random.random() < outlier_probability:
            outlier = np.random.normal(avg + 20, std_dev)
            temperatures.append(round(outlier, 2))
            if actual_outlier_probability > 0.03:
                actual_outlier_probability = actual_outlier_probability - 0.04
        else:
            # Generate a normal temperature value
            temperature = np.random.normal(avg, std_dev)
            temperatures.append(round(temperature, 2))
    return temperatures
