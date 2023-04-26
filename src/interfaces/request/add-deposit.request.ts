import { PortfolioEnum } from "../../models/deposit-portfolio-allocation.model";
import { DepositTypeEnum } from "../../models/deposit.model";

interface DepositToPlan {
  amount: number;
  portfolio: PortfolioEnum;
}

export interface AddDepositRequest {
  user_id: string;
  bank_name: string;
  bank_card_number: string;
  deposit_amount: number;
  deposit_type: DepositTypeEnum;
  deposit_date: string;
  deposit_to_plans: DepositToPlan[];
}
