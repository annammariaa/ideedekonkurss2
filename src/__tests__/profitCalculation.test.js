import { describe, it, expect } from 'vitest';

function calculateProfit(savingsBalance, insurancePerMonth, portfolio) {
  const income = (savingsBalance * 0.005) + (insurancePerMonth * 0.2 * 12) + (portfolio > 100000 ? (portfolio - 100000) * 0.0001 : 0);
  const expenses = 240;
  return Math.round(income - expenses);
}

describe('Profit Calculation', () => {
  it('calculates profit correctly for default values', () => {
    const profit = calculateProfit(150000, 150, 150000);
    expect(profit).toBe(555);
  });

  it('calculates profit correctly for zero values', () => {
    const profit = calculateProfit(0, 0, 0);
    expect(profit).toBe(-240);
  });

  it('calculates profit correctly for high portfolio', () => {
    const profit = calculateProfit(150000, 150, 200000);
    expect(profit).toBe(560);
  });

  it('calculates profit correctly for negative insurance', () => {
    const profit = calculateProfit(150000, -150, 150000);
    expect(profit).toBe(555);
  });
});