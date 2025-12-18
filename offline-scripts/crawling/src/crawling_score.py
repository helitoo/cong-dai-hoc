
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

import time

import pandas as pd

import re

import winsound

from crawling_helpers import get_method, str2num, get_subject_group

# Input paths

DF_SCHOOL_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\seating_data\school.csv'
CRAWLING_LINK = r'https://diemthi.tuyensinh247.com/diem-chuan/dai-hoc-bach-khoa-dai-hoc-quoc-gia-tphcm-QSB.html'
CRAWLING_YEAR = r'2025'

# Output paths

SCORE_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\crawled_data\score.csv'
EXCEPTION_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\crawled_data\exception.csv'


# GET SEAT DATA FROM BASE

df_school = pd.read_csv(DF_SCHOOL_PATH, dtype='string')[['id', 'name']]

scores = []
exceptions = []

# CRAWLING DATA FROM WEB

options = Options()
# options.add_argument('--headless')
# options.add_argument('--disable-gpu')
# options.add_argument('--window-size=1920x1080')
# options.add_argument('--log-level=3')

driver = webdriver.Chrome(options=options)
driver.get(CRAWLING_LINK)

driver.implicitly_wait(40)


# Get some statictis for this algorithm
start_time = time.time()

# Start crawling
for index, school in enumerate(df_school.itertuples(index=False)):
    
    # Type keys into search box
    search_box = driver.find_element(By.CSS_SELECTOR, 'input.ant-select-selection-search-input')
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", search_box)
    for c in school.id:
        search_box.send_keys(c)
        time.sleep(0.1)
    time.sleep(1)
    search_box.send_keys(Keys.ENTER)
    time.sleep(1)
    
    # Check current school, if not valid, continue
    try:
        if school.id not in driver.current_url:
            search_box = driver.find_element(By.CSS_SELECTOR, 'input.ant-select-selection-search-input')
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", search_box)
            for c in school.name:
                search_box.send_keys(c)
                time.sleep(0.1)
            time.sleep(1)
            search_box.send_keys(Keys.ENTER)
            time.sleep(1)
            if school.id not in driver.current_url:
                raise ValueError('Invalid School')
    except:
        continue
        
    
    time.sleep(1)
    titles = driver.find_elements(By.CSS_SELECTOR, '.cutoff-table .table__title')
    tables = driver.find_elements(By.CSS_SELECTOR, '.cutoff-table .ant-table-tbody')
    
    if not titles or not tables:
        exceptions.append(school.id)
        print(f'{round((index + 1) / len(df_school) * 100, 4)}% In {year} REJECT {school.id}')
        continue
    
    # For each table and title
    
    for title, table in zip(titles, tables):
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", table)
        
        # Verify year
        
        match = re.findall(CRAWLING_YEAR ,title.text)
        year = None
        if match:
            year = match[0]
        else:
            exceptions.append(school.id)
            print(f'{round((index + 1) / len(df_school) * 100, 4)}% In {year} REJECT {school.id}')
            continue
        
        # Get other fields
        
        rows = table.find_elements(By.TAG_NAME, 'tr')
        
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, 'td')
            col_data = [col.text for col in cols]
            
            major_id = col_data[1].replace(' ', '')
            
            major_name = col_data[2].strip()
            
            score = str2num(col_data[4])
            
            subject_group_ids = [ get_subject_group(subject_group_id) for subject_group_id in col_data[3].replace(' ', '').split(';')]
            
            note = col_data[5].strip()
            
            method_id = get_method(title.text, note)
            
            # Raw convert score
            
            converted_score = score
            
            if (method_id == 'thpt' or method_id == 'thhb') and ('nhân 2' in note or 'hệ số 2' in note or 'x2' in note or '40' in note) and score > 30:
                converted_score /= 40 * 30
            
            if (method_id == 'thpt' or method_id == 'thhb') and ('thang 4' in note) and score <= 4:
                converted_score /= 4 * 30
            
            if (method_id == 'thpt' or method_id == 'thhb') and ('thang 10' in note) and score <= 10:
                converted_score /= 10 * 30
            
            if (method_id == 'ccpt' and score > 30):
                if ('SAT' in note):
                    converted_score /= 1600 * 30
                elif ('IB' in note):
                    converted_score /= 45 * 30
                elif ('ACT' in note):
                    converted_score /= 36 * 30
            
            if not score or not method_id:
                exceptions.append(school.id)
                print(f'{round((index + 1) / len(df_school) * 100, 4)}% In {year} REJECT {school.id}')
                continue
            
            for subject_group_id in subject_group_ids:
                scores.append({
                    'id': f'{school.id}-{major_id}-{method_id}-{subject_group_id}-{year}-{time.time() * 1000 - start_time * 1000}',
                    'school_id' : school.id,
                    'method_id' : method_id,
                    'subject_group_id': subject_group_id,
                    'year': year,
                    'converted_score': converted_score,
                    'score': score,
                    'major_id' : major_id,
                    'major_name': major_name,
                    'note': note
                })
            
            print(f'{round((index + 1) / len(df_school) * 100, 4)}% In {year} DONE {school.id} {major_id}')


driver.close()

pd.DataFrame(scores).drop_duplicates(subset=['school_id', 'major_id', 'method_id', 'subject_group_id', 'note', 'year']).to_csv(SCORE_PATH, index=False)
pd.DataFrame(exceptions).drop_duplicates().to_csv(EXCEPTION_PATH, index=False)

endTime = time.time()
winsound.Beep(1000, 1000)
print(f'Done in {round((endTime - start_time) / 60, 4)} minutes.')

