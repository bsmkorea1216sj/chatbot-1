// 매출·이익률 계산기 (실습용 — 일부러 버그가 남아 있습니다)
const revenueInput = document.getElementById("revenue");
const costInput = document.getElementById("cost");
const result = document.getElementById("result");

document.getElementById("calc").addEventListener("click", () => {
  const revenue = Number(revenueInput.value);
  const cost = Number(costInput.value);

  const profit = revenue - cost;
  const margin = (profit / revenue) * 100; // 매출이 0원이면 어떻게 될까요?

  result.textContent =
    `순이익: ${profit.toLocaleString()}원 | 이익률: ${margin.toFixed(1)}%`;
});

document.getElementById("reset").addEventListener("click", () => {
  revenueInput.value = "";
  costInput.value = "";
  result.textContent = "값을 입력하고 계산하기를 눌러 주세요.";
});
