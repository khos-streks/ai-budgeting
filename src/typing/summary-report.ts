export interface ISummaryReport {
	execution_percent: number;
	top_positive_deviation: {
		budget_item: string;
		plan_amount: number;
		fact_amount: number;
		deviation_amount: number;
		deviation_percent: number;
	};
	top_negative_deviation: {
		budget_item: string;
		plan_amount: number;
		fact_amount: number;
		deviation_amount: number;
		deviation_percent: number;
	};
	main_causes: string[];
	anomaly_insights: string;
	recommendations: string;
}
