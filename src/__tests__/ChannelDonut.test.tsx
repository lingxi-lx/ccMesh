import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChannelDonut } from "@/pages/Statistics/_components/cursor/ChannelDonut";
import type { CursorPlanUsage } from "@/services/modules/cursorUsage";

const planUsage: CursorPlanUsage = {
  totalSpend: 2500,
  includedSpend: 2500,
  bonusSpend: 0,
  remaining: 4500,
  limit: 7000,
  totalPercentUsed: 40,
  autoPercentUsed: 40,
  apiPercentUsed: 28.6,
};

describe("ChannelDonut", () => {
  it("有聚合数据时展示已用 / 预估 / 保底", () => {
    render(
      <ChannelDonut
        planUsage={planUsage}
        aggregations={[
          { tier: 2, totalCents: 500 },
          { tier: 1, totalCents: 2000 },
        ]}
      />,
    );
    expect(screen.getByText("40.0%")).toBeInTheDocument();
    expect(screen.getByText("28.6%")).toBeInTheDocument();
    expect(screen.getAllByText(/已用/).length).toBe(2);
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByText("$12.50")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$70.00")).toBeInTheDocument();
    expect(screen.getByText(/预估/)).toBeInTheDocument();
    expect(screen.getByText(/保底/)).toBeInTheDocument();
  });

  it("无聚合数据时只展示进度百分比", () => {
    render(<ChannelDonut planUsage={planUsage} />);
    expect(screen.getByText("40.0%")).toBeInTheDocument();
    expect(screen.queryByText(/已用/)).not.toBeInTheDocument();
    expect(screen.queryByText(/预估/)).not.toBeInTheDocument();
  });

  it("Auto 占满时预估显示 —", () => {
    render(
      <ChannelDonut
        planUsage={{ ...planUsage, autoPercentUsed: 100 }}
        aggregations={[{ tier: 2, totalCents: 500 }]}
      />,
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
