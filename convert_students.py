#!/usr/bin/env python3
"""Convert student awards CSV to JSON for React app"""
import json
import csv

data = []
with open('/Users/zengyiqing/Documents/test/ssoi/data/sszx.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

print(f"Total records: {len(data)}")

# Extract unique students
students = {}
for entry in data:
    name = entry['name']
    if name not in students:
        students[name] = {
            'name': name,
            'gender': entry.get('gender', ''),
            'awards': []
        }
    # Add award info
    award = {
        'contest': entry['contest'],
        'pride': entry['pride'],
        'grade': entry.get('grade', ''),
        'school': entry.get('school', ''),
        'score': entry.get('score', ''),
        'province': entry.get('province', '')
    }
    students[name]['awards'].append(award)

students_list = list(students.values())
print(f"Unique students: {len(students_list)}")

# Extract contest types
contests = set()
for entry in data:
    contest = entry['contest']
    # Get base contest name (remove year)
    contest_name = ''.join([c for c in contest if not c.isdigit()])
    contests.add(contest_name)

print(f"Contest types: {sorted(contests)}")

# Save JSON files
with open('/Users/zengyiqing/Documents/test/ssoi-web/src/data/students.json', 'w', encoding='utf-8') as f:
    json.dump(students_list, f, ensure_ascii=False, indent=2)

with open('/Users/zengyiqing/Documents/test/ssoi-web/src/data/awards.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Data saved successfully!")