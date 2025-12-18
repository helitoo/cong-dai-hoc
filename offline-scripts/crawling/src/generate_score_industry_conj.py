
import time

import pandas as pd
from sentence_transformers import SentenceTransformer, util
import torch

import re

import winsound

# Input paths

DF_SCORE_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\cleaned_data\score.csv'
INDUSTRY_L3_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\seating_data\industry_l3.csv'

# Output paths

SCORE_INDUSTRY_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\cleaned_data\score_industry.csv'


model = SentenceTransformer('distiluse-base-multilingual-cased-v2')

# GET SEAT DATA FROM BASE

df_score = pd.read_csv(DF_SCORE_PATH, dtype='str')[['id', 'major_id', 'major_name']]
df_score = df_score.fillna('')


df_industry = pd.read_csv(INDUSTRY_L3_PATH, dtype='str')
df_industry['industry_l2_id'] = df_industry['industry_l2_id'].str.zfill(2)
df_industry['id'] = df_industry['id'].str.zfill(2)

df_industry_ids = (df_industry['industry_l1_id'] + df_industry['industry_l2_id'] + df_industry['id']).tolist()

df_industry_names = df_industry['name'].tolist()
df_industry_names = model.encode(df_industry_names, convert_to_tensor=True)


# Get some statictis for this algorithm
start_time = time.time()

def find_linking_major_ids(curr_major_id: str, curr_major_name: str):
    # Làm sạch ID và tên ngành
    curr_major_id = re.sub(r'[a-zA-Z]|[-_.].*', '', curr_major_id)
    curr_major_name = re.sub(r'\(.*?\)', '', curr_major_name).replace('*', '').strip()

    # Nếu ID hợp lệ, trả về luôn
    if curr_major_id and (curr_major_id in df_industry_ids):
        return [curr_major_id]

    # Encode tên ngành đang xét (1 vector)
    encode_curr_major_name = model.encode(curr_major_name, convert_to_tensor=True)

    # So sánh batch với tất cả ngành chuẩn (trả về tensor [1 x N])
    cos_scores = util.cos_sim(encode_curr_major_name, df_industry_names)[0]

    # Tìm điểm cao nhất
    max_score = torch.max(cos_scores).item()

    # Lọc các ngành có điểm gần nhất
    linking_major_ids = [
        df_industry_ids[i]
        for i, score in enumerate(cos_scores)
        if abs(score.item() - max_score) <= 0.05
    ]

    return linking_major_ids


major_industry = []

for index, row in df_score.iterrows():
    linking_major_ids = find_linking_major_ids(row['major_id'], row['major_name'])
    
    for linking_major_id in linking_major_ids:
        major_industry.append({
            'score_id': row['id'],
            'industry_l1_id': linking_major_id[:3],
            'industry_l2_id': linking_major_id[3:5],
            'industry_l3_id': linking_major_id[5:],
        })
        
        print(f'{round((index + 1) / len(df_score) * 100, 4)}% {row['major_id']} linked with {linking_major_id[:3]}-{linking_major_id[3:5]}-{linking_major_id[5:]}')


pd.DataFrame(major_industry).to_csv(SCORE_INDUSTRY_PATH, index=False)

endTime = time.time()
winsound.Beep(1000, 1000)
print(f'Done in {round((endTime - start_time) / 60, 4)} minutes.')

