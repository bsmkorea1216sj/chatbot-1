// 매출·이익률 계산기 (수정 완료 버전 — 정답 비교용)
const revenueInput = document.getElementById("revenue");
const costInput = document.getElementById("cost");
const result = document.getElementById("result");

document.getElementById("calc").addEventListener("click", () => {
  if (revenueInput.value === "" || costInput.value === "") {
    result.textContent = "⚠️ 매출액과 총 비용을 모두 입력해 주세요.";
    return;
  }
  const revenue = Number(revenueInput.value);
  const cost = Number(costInput.value);

  if (revenue < 0 || cost < 0) {
    result.textContent = "⚠️ 음수는 입력할 수 없습니다.";
    return;
  }
  if (revenue === 0) {
    result.textContent = "⚠️ 매출액이 0원이면 이익률을 계산할 수 없습니다.";
    return;
  }

  const profit = revenue - cost;
  const margin = (profit / revenue) * 100;
  result.textContent =
    `순이익: ${profit.toLocaleString()}원 | 이익률: ${margin.toFixed(1)}%`;
});

document.getElementById("reset").addEventListener("click", () => {
  revenueInput.value = "";
  costInput.value = "";
  result.textContent = "값을 입력하고 계산하기를 눌러 주세요.";
});
