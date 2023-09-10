import pandas as pd
import json
import numpy as np
df = pd.read_csv('companies.csv', encoding='latin-1')

columns_to_remove = ['Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7','Unnamed: 8','Unnamed: 9','Unnamed: 10','Unnamed: 11','Unnamed: 12']

# Remove the specified columns
df = df.drop(columns=columns_to_remove)
df.replace(np.nan, 'Not available', inplace=True)
print(df.head())

json_records = df.to_dict(orient="records")

# Specify the output JSON file
output_file = "../../../frontend/src/companies.json"

# Write the list of JSON records to the output file
with open(output_file, "w") as f:
    json.dump(json_records, f, indent=4)
# df.to_json(r"D:\Web Development\Portfolio-Optimizer\backend\controllers\calculations\companies.json", orient="records", lines=True)