
import pandas as pd

# Input - Output paths
DF_PATH = r'D:\project\cong-dai-hoc\offline-scripts\crawling\cleaned_data\score.csv'

score_df = pd.read_csv(DF_PATH)

# UPDATE

update_mask = (
    # (score_df['school_id'] == 'NHF') &
    # (score_df['method_id'] == 'xtkh') &
    # (score_df['score'] >= 30) &
    (score_df['note'].str.contains('ĐGNL Sư phạm Hà Nội', na=False))

)

# score_df.loc[update_mask, 'converted_score'] = score_df.loc[update_mask, 'score'] / 40 * 30
score_df.loc[update_mask, 'method_id'] = 'dgsp'
# score_df.loc[update_mask, 'note'] = 'Chứng chỉ TestAS'

score_df.to_csv(DF_PATH, index=False)

# VIEW

view_mask = (
    (score_df['method_id'] != "a")
    # (score_df['method_id'] == 'dghn') &
    # (score_df['converted_score'] > 30)
)

print(score_df.loc[view_mask, ['school_id', 'method_id', 'converted_score', 'score', 'note']].sort_values(by='converted_score', ascending=False))

