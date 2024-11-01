"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Switch } from "@/components/ui/switch";
import { useMutation, useStorage } from "@liveblocks/react/suspense";

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

export default function ResultChart() {
  const selections = useStorage((state) => state.selections);
  const gameState = useStorage((state) => state.gameState);
  const validSeclectionList = selections.filter((item) => item.value != null);

  const averagePoints = React.useMemo(() => {
    const validSelectionLength = validSeclectionList.length;
    if (!validSelectionLength) return 0;
    const result =
      validSeclectionList.reduce((acc, curr) => acc + (curr.value ?? 0), 0) /
      validSelectionLength;

    return gameState.isResultRounded ? Math.ceil(result) : result.toFixed(1);
  }, [gameState.isResultRounded, validSeclectionList]);

  const chartConfig = React.useMemo(() => {
    let config: Record<string, any> = {} satisfies ChartConfig;
    validSeclectionList.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      };
    });

    return config;
  }, [validSeclectionList]);

  const labelContent = ({ viewBox }: { viewBox?: any }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      return (
        <text
          x={viewBox.cx}
          y={viewBox.cy}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan
            x={viewBox.cx}
            y={viewBox.cy}
            className="fill-foreground text-4xl font-bold"
          >
            {averagePoints.toLocaleString()}
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy ?? 0) + 24}
            className="fill-muted-foreground"
          >
            Point(s)
          </tspan>
        </text>
      );
    }
  };

  const onCheckChange = useMutation(({ storage }, checked) => {
    const gameStateStorage = storage.get("gameState");
    gameStateStorage.set("isResultRounded", checked);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Point estimation result</CardTitle>
        <CardDescription className="flex items-center gap-2">
          Round result
          <Switch
            onCheckedChange={onCheckChange}
            checked={gameState.isResultRounded}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={validSeclectionList.map((item, index) => ({
                ...item,
                fill: colors[index % colors.length],
              }))}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label content={labelContent} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total vote {validSeclectionList.length} / {selections.length}
        </div>
      </CardFooter>
    </Card>
  );
}
