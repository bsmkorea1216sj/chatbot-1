import csv, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
out=sys.argv[1]
# 일자, 요일, 카테고리, 상품명, 판매수량, 단가, 매출액
rows=[]
days=[("2026-11-16","월"),("2026-11-17","화"),("2026-11-18","수"),("2026-11-19","목"),("2026-11-20","금")]
items=[("텀블러","스테인리스 텀블러 500ml(네이비)",18900),("텀블러","스테인리스 텀블러 350ml(화이트)",15900),
       ("머그컵","세라믹 머그컵 세트(2P)",24000),("원두","하우스 블렌드 원두 500g",19800),("선물세트","연말 선물 세트 A",39000)]
qty=[[70, 38, 89, 101, 44], [80, 44, 105, 110, 70], [82, 49, 108, 115, 77], [79, 47, 108, 112, 79], [82, 47, 112, 115, 82]]
for d,row in zip(days,qty):
    for it,q in zip(items,row):
        rows.append([d[0],d[1],it[0],it[1],q,it[2],q*it[2]])
tot=sum(r[6] for r in rows)
# 총액을 보고서(48,200,000원)와 맞추도록 마지막 행 보정 대신 수량으로 조정
print("total",tot, "qty",sum(r[4] for r in rows))
hdr=["일자","요일","카테고리","상품명","판매수량","단가(원)","매출액(원)"]
with open(f"{out}/sales_data.csv","w",newline="",encoding="utf-8-sig") as f:
    w=csv.writer(f); w.writerow(hdr); w.writerows(rows)
wb=Workbook(); ws=wb.active; ws.title="일별매출"
ws.append(hdr)
for r in rows: ws.append(r)
n=len(rows)+1
ws.append([]); ws.append(["합계","","","",f"=SUM(E2:E{n})","",f"=SUM(G2:G{n})"])
for c in ws[1]: c.font=Font(bold=True,color="FFFFFF"); c.fill=PatternFill("solid",fgColor="1E2A4A")
for col,wd in zip("ABCDEFG",[12,6,10,32,10,11,14]): ws.column_dimensions[col].width=wd
for r in ws.iter_rows(min_row=2):
    for c in r[4:7]: c.number_format="#,##0"
ws["A1"].comment=None
ws2=wb.create_sheet("안내"); ws2["A1"]="※ Claude AI 실습용 가상 데이터입니다. 실제 회사·상품과 관계없습니다."
wb.save(f"{out}/sales_data.xlsx")
