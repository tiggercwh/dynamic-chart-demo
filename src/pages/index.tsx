import { ChartContainer } from "@/components/sharedStyles";
import chartConfig from "./chartConfig.json";
import FedRatesChart from "@/components/FedRatesChart";
import ratedataZero from "@/data/ratereact_data_0.json";
import ratedataOne from "@/data/ratereact_data_1.json";
import ratedataTwo from "@/data/ratereact_data_2.json";
import ratedataThree from "@/data/ratereact_data_3.json";
import { isMobile, isTablet, isDesktop } from "react-device-detect";
import rates from "@/data/rates.json";
// import rateTimePeriods from "@/data/ratereact_time_periods.json";

export default function Home() {
  const fedRatesData = [
    ratedataZero,
    ratedataOne,
    ratedataTwo,
    ratedataThree,
    // rates,
    // rateTimePeriods,
  ];

  const isSimpleLayout = isMobile || isTablet;

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
            lightColor={config?.lightColor}
            mainColor={config?.mainColor}
            rateData={rates}
            title={config?.title}
          />
        </ChartContainer>
      ))}
    </div>
  );
}
