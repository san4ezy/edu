import React from "react";
import {Plan} from "../../types/Course.ts";

interface PlanCardProps {
    plan: Plan;
    onBuy: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onBuy }) => {
    const currencySign = (currency: string) => {
        switch (currency) {
            case "UAH":
                return "₴";
            case "USD":
                return "$";
            case "EUR":
                return "€";
            case "GBP":
                return "£";
            case "CNY":
                return "¥";
            default:
                return "$";
        }
    }

    return (
        <div className="card w-full sm:w-64 bg-base-100 shadow-sm flex-shrink-0">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{plan.name}</h2>
                    <span className="text-xl">{currencySign(plan.price.currency)}{plan.price.amount}</span>
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span>High-resolution image generation</span>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span>Customizable style templates</span>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span>Batch processing capabilities</span>
                    </li>
                </ul>
                <div className="mt-6">
                    <button
                        className="btn btn-warning btn-block"
                        onClick={() => {onBuy(plan.id)}}
                    >Buy</button>
                </div>
            </div>
        </div>
    );
};

export default PlanCard;