using System;

namespace CorrectPrice.Client.Models
{
    public class CashFlowData
    {
        public CashFlowDataByMonth[] CashFlowDataByMonth { get; set; }
    }

    public class CashFlowDataByMonth
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Name { get; set; }

        public EarningsItem[] EarningsItems { get; set; }

        public InvestmentItem[] InvestmentItems { get; set; }

        public decimal CashFlow { get; set; }
    }
}
