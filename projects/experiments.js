window.courseExperiments=[
  {title:"Working with Different Data Formats using pandas",file:"Experiment-1.docx",sections:[
    {title:"Reading and Writing CSV Data",code:`from io import StringIO
import pandas as pd

csv_data = """name,score,department
Asha,88,Data Science
Ravi,76,Computer Science
Meena,93,Data Science"""
students = pd.read_csv(StringIO(csv_data))
print("CSV data:")
print(students)
print("\\nAverage score:", students["score"].mean())
print("\\nCSV output:")
print(students.to_csv(index=False))`},
    {title:"Reading and Writing JSON Data",code:`from io import StringIO
import json
import pandas as pd

records = [
    {"name": "Asha", "score": 88},
    {"name": "Ravi", "score": 76},
    {"name": "Meena", "score": 93}
]
json_text = json.dumps(records, indent=2)
students = pd.read_json(StringIO(json_text))
print("JSON records:")
print(json_text)
print("\\nLoaded as a DataFrame:")
print(students)
print("\\nFirst student:", students.iloc[0]["name"])`},
    {title:"Reading and Writing Excel Files",code:`from io import BytesIO
import pandas as pd

students = pd.DataFrame({
    "name": ["Asha", "Ravi", "Meena"],
    "score": [88, 76, 93]
})
workbook = BytesIO()
students.to_excel(workbook, index=False, engine="openpyxl")
workbook.seek(0)
loaded = pd.read_excel(workbook, engine="openpyxl")
print("Excel workbook round trip:")
print(loaded)
print("\\nRows:", len(loaded), "| Average:", loaded["score"].mean())`}
  ]},
  {title:"Interacting with Web APIs and Databases",file:"Experiment-2.docx",sections:[
    {title:"API Response to DataFrame",code:`import json
import pandas as pd

# A local API-shaped response keeps this example reproducible.
response = """[
  {"id": 101, "title": "Clean the dataset", "state": "open"},
  {"id": 102, "title": "Add charts", "state": "closed"},
  {"id": 103, "title": "Review missing values", "state": "open"}
]"""
issues = pd.DataFrame(json.loads(response))
print(issues[["id", "title", "state"]])
print("\\nOpen issues:", (issues["state"] == "open").sum())`},
    {title:"SQLite Database Operations",code:`import sqlite3
import pandas as pd

with sqlite3.connect(":memory:") as connection:
    connection.execute("CREATE TABLE students (id INTEGER, name TEXT, score REAL)")
    connection.executemany(
        "INSERT INTO students VALUES (?, ?, ?)",
        [(1, "Asha", 88), (2, "Ravi", 76), (3, "Meena", 93)]
    )
    result = pd.read_sql_query(
        "SELECT name, score FROM students WHERE score >= 80 ORDER BY score DESC",
        connection
    )
    print("Students scoring at least 80:")
    print(result)`},
    {title:"Parse and Summarize JSON API Data",code:`import json
import pandas as pd

payload = {
    "items": [
        {"product": "Notebook", "quantity": 3, "price": 45},
        {"product": "Pen", "quantity": 5, "price": 10},
        {"product": "Folder", "quantity": 2, "price": 30}
    ]
}
items = pd.json_normalize(payload, record_path="items")
items["total"] = items["quantity"] * items["price"]
print(items)
print("\\nOrder total:", items["total"].sum())`}
  ]},
  {title:"Data Cleaning and Preparation",file:"Experiment-3.docx",sections:[
    {title:"Handle Missing Data",code:`import pandas as pd
import numpy as np

data = pd.DataFrame({
    "student": ["Asha", "Ravi", "Meena", "Dev"],
    "score": [88, np.nan, 93, np.nan],
    "attendance": [0.95, 0.80, np.nan, 0.90]
})
print("Missing values:")
print(data.isna().sum())
cleaned = data.copy()
cleaned["score"] = cleaned["score"].fillna(cleaned["score"].mean())
cleaned["attendance"] = cleaned["attendance"].fillna(cleaned["attendance"].median())
print("\\nAfter filling missing values:")
print(cleaned)`},
    {title:"Data Transformation",code:`import pandas as pd

students = pd.DataFrame({
    "student": ["asha", "RAVI", "Meena"],
    "gender": ["female", "male", "female"],
    "score": [88, 76, 93]
})
students["student"] = students["student"].str.title()
students["gender_code"] = students["gender"].map({"female": 1, "male": 0})
students["result"] = students["score"].apply(lambda score: "Pass" if score >= 50 else "Review")
print(students.rename(columns={"student": "Student"}))`},
    {title:"Outlier Detection with IQR",code:`import pandas as pd

scores = pd.Series([62, 70, 72, 75, 78, 80, 83, 88, 95, 250], name="score")
q1, q3 = scores.quantile([0.25, 0.75])
iqr = q3 - q1
lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
outliers = scores[(scores < lower) | (scores > upper)]
print(f"IQR bounds: {lower:.1f} to {upper:.1f}")
print("Potential outliers:")
print(outliers)`}
  ]},
  {title:"Data Wrangling",file:"Experiment-4.docx",sections:[
    {title:"Hierarchical Indexing",code:`import pandas as pd

index = pd.MultiIndex.from_arrays(
    [["Engineering", "Engineering", "Science", "Science"],
     ["CSE", "ECE", "Physics", "Chemistry"]],
    names=["Department", "Branch"]
)
marks = pd.Series([85, 78, 92, 88], index=index, name="marks")
print("All marks:")
print(marks)
print("\\nEngineering students:")
print(marks.loc["Engineering"])
print("\\nCSE mark:", marks.loc[("Engineering", "CSE")])`},
    {title:"Stack and Unstack Data",code:`import pandas as pd

scores = pd.DataFrame(
    {"Midterm": [82, 91], "Final": [88, 94]},
    index=pd.Index(["Asha", "Meena"], name="student")
)
print("Wide table:")
print(scores)
long_scores = scores.stack().rename("score").reset_index()
print("\\nStacked rows:")
print(long_scores)
print("\\nUnstacked table:")
print(long_scores.pivot(index="student", columns="level_1", values="score"))`},
    {title:"Merge and Combine DataFrames",code:`import pandas as pd

left = pd.DataFrame({"student": ["Asha", "Ravi"], "score": [88, None]}).set_index("student")
right = pd.DataFrame({"student": ["Ravi", "Meena"], "score": [76, 93]}).set_index("student")
print("Merged by index:")
print(left.merge(right, left_index=True, right_index=True, how="outer", suffixes=("_left", "_right")))
print("\\nFill overlapping values with combine_first:")
print(left.combine_first(right))`}
  ]},
  {title:"Data Visualization with Matplotlib and Seaborn",file:"Experiment-5.docx",sections:[
    {title:"Line Plot",code:`import matplotlib.pyplot as plt
import pandas as pd

daily = pd.DataFrame({
    "day": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "visits": [12, 18, 15, 24, 21]
})
plt.plot(daily["day"], daily["visits"], marker="o")
plt.title("Daily visits")
plt.xlabel("Day")
plt.ylabel("Visits")
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("/tmp/experiment-plot.png")
print("Line chart created from daily visit data.")
print(daily.to_string(index=False))`},
    {title:"Bar Plot",code:`import matplotlib.pyplot as plt
import pandas as pd

sales = pd.DataFrame({
    "product": ["Books", "Pens", "Folders", "Bags"],
    "units": [8, 15, 6, 11]
})
plt.bar(sales["product"], sales["units"], color="#e34cae")
plt.title("Units sold by product")
plt.xlabel("Product")
plt.ylabel("Units")
plt.tight_layout()
plt.savefig("/tmp/experiment-plot.png")
print("Bar chart created.")
print(sales.to_string(index=False))`},
    {title:"Histogram and Density Plot",code:`import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

marks = pd.Series([52, 61, 65, 68, 72, 74, 78, 81, 85, 91, 94])
plt.hist(marks, bins=5, density=True, alpha=0.7, color="#8f69ce", edgecolor="white")
grid = np.linspace(marks.min(), marks.max(), 100)
bandwidth = 6
kernel = np.exp(-0.5 * ((grid[:, None] - marks.to_numpy()) / bandwidth) ** 2)
density = kernel.mean(axis=1) / (bandwidth * np.sqrt(2 * np.pi))
plt.plot(grid, density, color="#e34cae", linewidth=2, label="Density estimate")
plt.legend()
plt.title("Distribution of student marks")
plt.xlabel("Marks")
plt.ylabel("Density")
plt.tight_layout()
plt.savefig("/tmp/experiment-plot.png")
print("Histogram and density curve created.")
print("Mean:", round(marks.mean(), 2), "| Median:", marks.median())`}
  ]},
  {title:"Time Series Analysis",file:"Experiment-6.docx",sections:[
    {title:"Create a Time Series",code:`import pandas as pd

dates = pd.date_range("2026-01-01", periods=7, freq="D")
visits = pd.Series([12, 18, 15, 22, 17, 26, 20], index=dates, name="visits")
print("Daily observations:")
print(visits)
print("\\nWeekly total:", visits.sum())
print("Daily change:")
print(visits.diff().fillna(0))`},
    {title:"Time Zone Conversion",code:`import pandas as pd

times = pd.date_range("2026-01-01 09:00", periods=3, freq="D", tz="Asia/Kolkata")
print("Asia/Kolkata:")
print(times)
print("\\nConverted to UTC:")
print(times.tz_convert("UTC"))
print("\\nConverted to New York:")
print(times.tz_convert("America/New_York"))`},
    {title:"Period Arithmetic and Resampling",code:`import pandas as pd

months = pd.period_range("2026-01", periods=6, freq="M")
sales = pd.Series([12, 18, 15, 22, 17, 26], index=months)
print("Monthly periods:")
print(sales)
print("\\nThree-month totals:")
print(sales.resample("Q").sum())
print("\\nTwo months after the first period:", months[0] + 2)`}
  ]},
  {title:"Data Aggregation",file:"Experiment-7.docx",sections:[
    {title:"GroupBy and Aggregation",code:`import pandas as pd

students = pd.DataFrame({
    "department": ["CSE", "CSE", "DS", "DS", "CSE"],
    "score": [82, 91, 88, 95, 76]
})
print("Average score by department:")
print(students.groupby("department")["score"].mean())
print("\\nStudent count:")
print(students.groupby("department")["score"].count())`},
    {title:"Multiple Aggregates",code:`import pandas as pd

sales = pd.DataFrame({
    "category": ["A", "A", "B", "B", "B"],
    "revenue": [120, 90, 150, 80, 110]
})
summary = sales.groupby("category")["revenue"].agg(["count", "sum", "mean", "min", "max"])
print(summary.round(2))`},
    {title:"Group by Department and Year",code:`import pandas as pd

results = pd.DataFrame({
    "department": ["CSE", "CSE", "DS", "DS", "CSE", "DS"],
    "year": [2024, 2025, 2024, 2025, 2024, 2025],
    "score": [78, 85, 88, 92, 82, 89]
})
summary = results.groupby(["department", "year"])["score"].agg(["count", "mean"])
print(summary.round(1))`}
  ]},
  {title:"Web Scraping and Product Review Analysis",file:"Experiment-8.docx",sections:[
    {title:"Parse Authorized Local HTML",code:`from html.parser import HTMLParser

html = """
<article class="review"><p>Easy to use and very helpful</p></article>
<article class="review"><p>Good quality and fast delivery</p></article>
<article class="review"><p>Poor quality and disappointing</p></article>
"""
class ReviewParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_review = False
        self.reviews = []
    def handle_starttag(self, tag, attrs):
        self.in_review = tag == "article" and "review" in dict(attrs).get("class", "").split()
    def handle_endtag(self, tag):
        if tag == "article":
            self.in_review = False
    def handle_data(self, data):
        if self.in_review and data.strip():
            self.reviews.append(data.strip())

parser = ReviewParser()
parser.feed(html)
print("Reviews parsed from sample HTML:")
for review in parser.reviews:
    print("-", review)`},
    {title:"Review Text Exploration",code:`import re
from collections import Counter

reviews = [
    "Easy to use and very helpful",
    "Good quality and fast delivery",
    "Poor quality and disappointing"
]
words = [word for review in reviews for word in re.findall(r"[a-z]+", review.lower())]
print("Review count:", len(reviews))
print("Word count:", len(words))
print("Most common words:", Counter(words).most_common(5))
print("Average words per review:", round(len(words) / len(reviews), 2))`},
    {title:"Simple Review Sentiment Summary",code:`reviews = [
    "Easy to use and very helpful",
    "Good quality and fast delivery",
    "Poor quality and disappointing"
]
positive = {"easy", "helpful", "good", "fast"}
negative = {"poor", "disappointing"}
for review in reviews:
    words = set(review.lower().split())
    score = len(words & positive) - len(words & negative)
    sentiment = "positive" if score > 0 else "negative" if score < 0 else "neutral"
    print(f"{sentiment:8} | {review}")
print("\\nSample-only sentiment counts; no website was contacted.")`}
  ]},
  {title:"Case Study: Customer Personality Analysis",file:"Experiment-9.docx",sections:[
    {title:"Explore Customer Data",code:`import pandas as pd

customers = pd.DataFrame({
    "customer": ["Asha", "Ravi", "Meena", "Dev", "Sara"],
    "annual_income": [32, 35, 82, 91, 48],
    "web_purchases": [1, 2, 8, 9, 3],
    "campaign_spend": [20, 25, 110, 125, 42]
})
print(customers)
print("\\nSummary statistics:")
print(customers[["annual_income", "web_purchases", "campaign_spend"]].describe().round(1))`},
    {title:"Build Customer Segments",code:`import pandas as pd

customers = pd.DataFrame({
    "customer": ["Asha", "Ravi", "Meena", "Dev", "Sara"],
    "annual_income": [32, 35, 82, 91, 48],
    "web_purchases": [1, 2, 8, 9, 3]
})
def segment(row):
    if row["annual_income"] >= 70 and row["web_purchases"] >= 7:
        return "high-value"
    if row["web_purchases"] <= 2:
        return "occasional"
    return "growing"
customers["segment"] = customers.apply(segment, axis=1)
print(customers[["customer", "segment"]])
print("\\nSegment counts:")
print(customers["segment"].value_counts())`},
    {title:"Evaluate Campaign Results",code:`import pandas as pd

campaign = pd.DataFrame({
    "segment": ["high-value", "growing", "occasional"],
    "contacted": [40, 60, 50],
    "purchases": [12, 9, 5],
    "revenue": [1200, 630, 250],
    "cost": [160, 180, 125]
})
campaign["conversion_rate_pct"] = campaign["purchases"] / campaign["contacted"] * 100
campaign["net_revenue"] = campaign["revenue"] - campaign["cost"]
print(campaign[["segment", "conversion_rate_pct", "net_revenue"]].round(2))`}
  ]},
  {title:"Case Study: Text Emotion Detection",file:"Experiment-10.docx",sections:[
    {title:"Create a Labeled Text Dataset",code:`import pandas as pd

texts = pd.DataFrame({
    "text": [
        "I am happy with my progress",
        "This result makes me sad",
        "I feel excited about learning",
        "I am angry about the delay",
        "The class starts at noon"
    ],
    "label": ["joy", "sadness", "joy", "anger", "neutral"]
})
print(texts)
print("\\nExamples per emotion:")
print(texts["label"].value_counts())`},
    {title:"Preprocess Text",code:`import re

texts = [
    "I am HAPPY with my progress!",
    "This result makes me sad...",
    "I feel excited about learning."
]
stop_words = {"i", "am", "my", "me", "the", "a", "about"}
for text in texts:
    tokens = re.findall(r"[a-z]+", text.lower())
    cleaned = [word for word in tokens if word not in stop_words]
    print(f"{text} -> {cleaned}")`},
    {title:"Rule-Based Emotion Detection",code:`examples = [
    ("I feel happy and excited", "joy"),
    ("I feel sad today", "sadness"),
    ("That delay makes me angry", "anger"),
    ("The meeting starts at noon", "neutral")
]
keywords = {
    "joy": {"happy", "excited", "glad"},
    "sadness": {"sad", "unhappy", "upset"},
    "anger": {"angry", "mad", "furious"}
}
correct = 0
for text, expected in examples:
    words = set(text.lower().split())
    scores = {label: len(words & terms) for label, terms in keywords.items()}
    predicted = max(scores, key=scores.get) if max(scores.values()) else "neutral"
    correct += predicted == expected
    print(f"{text:35} -> {predicted} (expected {expected})")
print(f"\\nDemo accuracy: {correct / len(examples):.0%}")
print("This is a keyword demo, not a trained emotion model.")`}
  ]}
];
