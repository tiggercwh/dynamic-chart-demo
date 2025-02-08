import chartConfig from "./chartConfig.json";

export default function Home() {
  return (
    <div>
      {chartConfig.map((config) => (
        <ChartContainer
          key={config?.chartNumber}
          lightColor={config?.lightColor}
          mainColor={config?.mainColor}
        >
          <FedRatesChart
            chartData={fedRatesData[config?.chartNumber]}
            description={config?.description}
            highlightText={config?.highlightText}
            isSimpleLayout={isSimpleLayout}
            isWidescreen={isWidescreen}
            lightColor={config?.lightColor}
            mainColor={config?.mainColor}
            rateData={rateData}
            title={config?.title}
          />
        </ChartContainer>
      ))}
    </div>
  );
}
