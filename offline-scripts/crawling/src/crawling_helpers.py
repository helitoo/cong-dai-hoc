
def get_method(title : str, note : str):
    if 'ĐGNL BCA' in note:
        return 'dgca'
    if 'V-SAT' in title:
        return 'vsat'
    if 'ĐGNL HN' in title:
        return 'dghn'
    if 'ĐGNL HCM' in title:
        return 'dgsg'
    if 'Đánh giá Tư duy' in title:
        return 'dgtd'
    if 'ĐGNL ĐH Sư phạm HN' in title:
        return 'dgsp'
    if 'Chứng chỉ quốc tế' in title or 'XTTN diện 1.2' in note:
        return 'ccqt'
    if ('THPT' in title) or 'thi THPT' in note or 'tốt nghiệp' in note or 'TN THPT' in note:
        return 'thpt'
    if ('học bạ' in title) or ('XTTN diện 1.3' in note) or ('học bạ' in note) or ('ƯTXT, XT thẳng' in title):
        return 'thhb'
    if 'Điểm thi riêng' in title:
        return 'dgcb'
    else:
        return 'xtkh' # Ket hop


def str2num(string : str):
    if string:
        if '.' in string:
            return float(string)
        else:
            return int(string)
    else:
        return None


def get_subject_group(subject_group: str):
    subject_group = subject_group.upper()
    
    mapping = {
        # Toán, Lý, Hóa
        "A00": "G001",
        
        # Toán, Lý, Sinh
        "A02": "G002",
        
        # Toán, Lý, Văn
        "C01": "G003",
        
        # Toán, Lý, Sử
        "A03": "G004",
        
        # Toán, Lý, Địa
        "A04": "G005",
        
        # Toán, Lý, GDKT-PL
        "X05": "G006",
        
        # Toán, Lý, Tin
        "X06": "G007",
        "A0T": "G007",
        "GT1": "G007",
        "TH1": "G007",
        
        # Toán, Lý, Công nghệ CN
        "X07": "G008",
        "A0C": "G008",
        "TH3": "G008",
        
        # Toán, Lý, Công nghệ NN
        "X08": "G009",
        
        # Toán, Lý, Tiếng Anh
        "A01": "G010",
        
        # Toán, Hóa, Sinh
        "B00": "G011",
        
        # Toán, Hóa, Văn
        "C02": "G012",
        
        # Toán, Hóa, Sử
        "A05": "G013",
        
        # Toán, Hóa, Địa
        "A06": "G014",
        
        # Toán, Hóa, GDKT-PL
        "X09": "G015",
        
        # Toán, Hóa, Tin
        "X10": "G016",
        "TH4": "G016",
        
        # Toán, Hóa, Công nghệ CN
        "X11": "G017",
        "B0C": "G017",
        "TH5": "G017",
        
        # Toán, Hóa, Công nghệ NN
        "X12": "G018",
        
        # Toán, Hóa, Tiếng Anh
        "D07": "G019",
        
        # Toán, Sinh, Văn
        "B03": "G020",
        
        # Toán, Sinh, Sử
        "B01": "G021",
        
        # Toán, Sinh, Địa
        "B02": "G022",
        
        # Toán, Sinh, GDKT-PL
        "X13": "G023",
        
        # Toán, Sinh, Tin
        "X14": "G024",
        
        # Toán, Sinh, Công nghệ CN
        "X15": "G025",
        
        # Toán, Sinh, Công nghệ NN
        "X16": "G026",
        
        # Toán, Sinh, Tiếng Anh
        "B08": "G027",
        "D08": "G027",
        
        # Toán, Văn, Sử
        "C03": "G028",
        "A07": "G028",
        
        # Toán, Văn, Địa
        "C04": "G029",
        
        # Toán, Văn, GDKT-PL
        "X01": "G030",
        
        # Toán, Văn, Tin
        "X02": "G031",
        "K21": "G031",
        "TH6": "G031",
        "DK": "G031",
        "F01": "G031",
        "TH3": "G031",
        
        # Toán, Văn, Công nghệ CN
        "X03": "G032",
        "TH8": "G032",
        "K22": "G032",
        "E01": "G032",
        
        # Toán, Văn, Công nghệ NN
        "X04": "G033",
        
        # Toán, Văn, Tiếng Anh
        "D01": "G034",
        
        # Toán, Sử, Địa
        "A07": "G035",
        
        # Toán, Sử, GDKT-PL
        "X17": "G036",
        
        # Toán, Sử, Tin
        "X18": "G037",
        
        # Toán, Sử, Công nghệ CN
        "X19": "G038",
        
        # Toán, Sử, Công nghệ NN
        "X20": "G039",
        
        # Toán, Sử, Tiếng Anh
        "D09": "G040",
        
        # Toán, Địa, GDKT-PL
        "X21": "G041",
        
        # Toán, Địa, Tin
        "X22": "G042",
        
        # Toán, Địa, Công nghệ CN
        "X23": "G043",
        
        # Toán, Địa, Công nghệ NN
        "X24": "G044",
        
        # Toán, Địa, Tiếng Anh
        "D10": "G045",
        
        # Toán, GDKT-PL, Tin
        "X53": "G046",
        
        # Toán, GDKT-PL, Công nghệ CN
        "X54": "G047",
        
        # Toán, GDKT-PL, Công nghệ NN
        "X55": "G048",
        
        # Toán, GDKT-PL, Tiếng Anh
        "X25": "G049",
        "D84": "G049",
        
        # Toán, Tin, Công nghệ CN
        "X56": "G050",
        
        # Toán, Tin, Công nghệ NN
        "X57": "G051",
        
        # Toán, Tin, Tiếng Anh
        "X26": "G052",
        "K01": "G052",
        
        # Toán, Công nghệ CN, Công nghệ NN
        "G053": "G053",  # Không có trong normal-base
        
        # Toán, Công nghệ CN, Tiếng Anh
        "X27": "G054",
        "D0C": "G054",
        "K20": "G054",
        "TH5": "G054",
        "TH7": "G054",
        
        # Toán, Công nghệ NN, Tiếng Anh
        "X28": "G055",
        "K20": "G055",  # Lưu ý: K20 có thể map sang cả G032, G054, G055
        
        # Lý, Hóa, Sinh
        # Không có trong normal-base (có thể là A02 nhưng đã map ở trên)
        
        # Lý, Hóa, Văn
        "C05": "G057",
        
        # Lý, Hóa, Sử
        # Không có trong normal-base
        
        # Lý, Hóa, Địa
        # Không có trong normal-base
        
        # Lý, Hóa, GDKT-PL
        # Không có trong normal-base
        
        # Lý, Hóa, Tin
        # Không có trong normal-base
        
        # Lý, Hóa, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, Hóa, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Hóa, Tiếng Anh
        # Không có trong normal-base (có D07 nhưng là Toán, Hóa, Anh)
        
        # Lý, Sinh, Văn
        "C06": "G065",
        
        # Lý, Sinh, Sử
        # Không có trong normal-base
        
        # Lý, Sinh, Địa
        # Không có trong normal-base
        
        # Lý, Sinh, GDKT-PL
        # Không có trong normal-base
        
        # Lý, Sinh, Tin
        # Không có trong normal-base
        
        # Lý, Sinh, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, Sinh, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Sinh, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, Văn, Sử
        "C07": "G073",
        
        # Lý, Văn, Địa
        "C09": "G074",
        
        # Lý, Văn, GDKT-PL
        "X58": "G075",
        
        # Lý, Văn, Tin
        "X59": "G076",
        
        # Lý, Văn, Công nghệ CN
        "X60": "G077",
        
        # Lý, Văn, Công nghệ NN
        "X61": "G078",
        
        # Lý, Văn, Tiếng Anh
        "D11": "G079",
        
        # Lý, Sử, Địa
        # Không có trong normal-base
        
        # Lý, Sử, GDKT-PL
        # Không có trong normal-base
        
        # Lý, Sử, Tin
        # Không có trong normal-base
        
        # Lý, Sử, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, Sử, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Sử, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, Địa, GDKT-PL
        # Không có trong normal-base
        
        # Lý, Địa, Tin
        # Không có trong normal-base
        
        # Lý, Địa, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, Địa, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Địa, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, GDKT-PL, Tin
        # Không có trong normal-base
        
        # Lý, GDKT-PL, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, GDKT-PL, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, GDKT-PL, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # Lý, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Lý, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Lý, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Sinh, Văn
        "C08": "G101",
        
        # Hóa, Sinh, Sử
        # Không có trong normal-base
        
        # Hóa, Sinh, Địa
        # Không có trong normal-base
        
        # Hóa, Sinh, GDKT-PL
        # Không có trong normal-base
        
        # Hóa, Sinh, Tin
        # Không có trong normal-base
        
        # Hóa, Sinh, Công nghệ CN
        # Không có trong normal-base
        
        # Hóa, Sinh, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, Sinh, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Văn, Sử
        "C10": "G109",
        
        # Hóa, Văn, Địa
        "C11": "G110",
        
        # Hóa, Văn, GDKT-PL
        "X62": "G111",
        
        # Hóa, Văn, Tin
        "X63": "G112",
        
        # Hóa, Văn, Công nghệ CN
        "X64": "G113",
        
        # Hóa, Văn, Công nghệ NN
        "X65": "G114",
        
        # Hóa, Văn, Tiếng Anh
        "D12": "G115",
        
        # Hóa, Sử, Địa
        # Không có trong normal-base
        
        # Hóa, Sử, GDKT-PL
        # Không có trong normal-base
        
        # Hóa, Sử, Tin
        # Không có trong normal-base
        
        # Hóa, Sử, Công nghệ CN
        # Không có trong normal-base
        
        # Hóa, Sử, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, Sử, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Địa, GDKT-PL
        # Không có trong normal-base
        
        # Hóa, Địa, Tin
        # Không có trong normal-base
        
        # Hóa, Địa, Công nghệ CN
        # Không có trong normal-base
        
        # Hóa, Địa, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, Địa, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, GDKT-PL, Tin
        # Không có trong normal-base
        
        # Hóa, GDKT-PL, Công nghệ CN
        # Không có trong normal-base
        
        # Hóa, GDKT-PL, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, GDKT-PL, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # Hóa, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Hóa, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Hóa, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, Văn, Sử
        "C12": "G137",
        
        # Sinh, Văn, Địa
        "C13": "G138",
        
        # Sinh, Văn, GDKT-PL
        "X66": "G139",
        
        # Sinh, Văn, Tin
        "X67": "G140",
        
        # Sinh, Văn, Công nghệ CN
        "X68": "G141",
        
        # Sinh, Văn, Công nghệ NN
        "X69": "G142",
        
        # Sinh, Văn, Tiếng Anh
        "D13": "G143",
        
        # Sinh, Sử, Địa
        # Không có trong normal-base
        
        # Sinh, Sử, GDKT-PL
        # Không có trong normal-base
        
        # Sinh, Sử, Tin
        # Không có trong normal-base
        
        # Sinh, Sử, Công nghệ CN
        # Không có trong normal-base
        
        # Sinh, Sử, Công nghệ NN
        # Không có trong normal-base
        
        # Sinh, Sử, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, Địa, GDKT-PL
        # Không có trong normal-base
        
        # Sinh, Địa, Tin
        # Không có trong normal-base
        
        # Sinh, Địa, Công nghệ CN
        # Không có trong normal-base
        
        # Sinh, Địa, Công nghệ NN
        # Không có trong normal-base
        
        # Sinh, Địa, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, GDKT-PL, Tin
        # Không có trong normal-base
        
        # Sinh, GDKT-PL, Công nghệ CN
        # Không có trong normal-base
        
        # Sinh, GDKT-PL, Công nghệ NN
        # Không có trong normal-base
        
        # Sinh, GDKT-PL, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # Sinh, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # Sinh, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Sinh, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Sinh, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Văn, Sử, Địa
        "C00": "G165",
        
        # Văn, Sử, GDKT-PL
        "X70": "G166",
        
        # Văn, Sử, Tin
        "X71": "G167",
        
        # Văn, Sử, Công nghệ CN
        "X72": "G168",
        
        # Văn, Sử, Công nghệ NN
        "X73": "G169",
        
        # Văn, Sử, Tiếng Anh
        "D14": "G170",
        
        # Văn, Địa, GDKT-PL
        "X74": "G171",
        
        # Văn, Địa, Tin
        "X75": "G172",
        
        # Văn, Địa, Công nghệ CN
        "X76": "G173",
        
        # Văn, Địa, Công nghệ NN
        "X77": "G174",
        
        # Văn, Địa, Tiếng Anh
        "D15": "G175",
        
        # Văn, GDKT-PL, Tin
        "Y07": "G176",
        
        # Văn, GDKT-PL, Công nghệ CN
        "Y08": "G177",
        
        # Văn, GDKT-PL, Công nghệ NN
        "Y09": "G178",
        
        # Văn, GDKT-PL, Tiếng Anh
        "X78": "G179",
        "D66": "G179",
        
        # Văn, Tin, Công nghệ CN
        "Y10": "G180",
        
        # Văn, Tin, Công nghệ NN
        "Y11": "G181",
        
        # Văn, Tin, Tiếng Anh
        "X79": "G182",
        "TH9": "G182",
        
        # Văn, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Văn, Công nghệ CN, Tiếng Anh
        "X80": "G184",
        
        # Văn, Công nghệ NN, Tiếng Anh
        "X81": "G185",
        
        # Sử, Địa, GDKT-PL
        # Không có trong normal-base
        
        # Sử, Địa, Tin
        # Không có trong normal-base
        
        # Sử, Địa, Công nghệ CN
        # Không có trong normal-base
        
        # Sử, Địa, Công nghệ NN
        # Không có trong normal-base
        
        # Sử, Địa, Tiếng Anh
        # Không có trong normal-base
        
        # Sử, GDKT-PL, Tin
        # Không có trong normal-base
        
        # Sử, GDKT-PL, Công nghệ CN
        # Không có trong normal-base
        
        # Sử, GDKT-PL, Công nghệ NN
        # Không có trong normal-base
        
        # Sử, GDKT-PL, Tiếng Anh
        # Không có trong normal-base
        
        # Sử, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # Sử, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # Sử, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # Sử, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Sử, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Sử, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Địa, GDKT-PL, Tin
        # Không có trong normal-base
        
        # Địa, GDKT-PL, Công nghệ CN
        # Không có trong normal-base
        
        # Địa, GDKT-PL, Công nghệ NN
        # Không có trong normal-base
        
        # Địa, GDKT-PL, Tiếng Anh
        # Không có trong normal-base
        
        # Địa, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # Địa, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # Địa, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # Địa, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Địa, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Địa, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # GDKT-PL, Tin, Công nghệ CN
        # Không có trong normal-base
        
        # GDKT-PL, Tin, Công nghệ NN
        # Không có trong normal-base
        
        # GDKT-PL, Tin, Tiếng Anh
        # Không có trong normal-base
        
        # GDKT-PL, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # GDKT-PL, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # GDKT-PL, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Tin, Công nghệ CN, Công nghệ NN
        # Không có trong normal-base
        
        # Tin, Công nghệ CN, Tiếng Anh
        # Không có trong normal-base
        
        # Tin, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
        
        # Công nghệ CN, Công nghệ NN, Tiếng Anh
        # Không có trong normal-base
    }
    
    return mapping.get(subject_group, "A000")