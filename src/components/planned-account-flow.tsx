import { Icon } from './icon';
export function PlannedAccountFlow() {
  const steps = [
    ['shield', 'Shared account', 'Use the approved account service when it becomes available.'],
    ['book', 'Review the offer', 'Check the seller, scope, price, period and renewal terms.'],
    ['ticket', 'Confirmed payment', 'Follow the enabled payment route and retain its reference.'],
    ['check', 'Check service dates', 'Confirm activation and the resulting invoice or receipt.'],
  ];
  return <figure className="planned-account-flow"><figcaption><span className="small-label">A visual guide to the planned journey</span><strong>From your account to service activation.</strong><p>Concept diagram for the future portal. These services are not available on this website yet.</p></figcaption><ol>{steps.map(([icon, title, text], index) => <li key={title}><span className="planned-flow-icon"><Icon name={icon} size={25} /></span><small>0{index + 1}</small><strong>{title}</strong><p>{text}</p>{index < steps.length - 1 && <span className="planned-flow-arrow"><Icon name="arrow" size={18} /></span>}</li>)}</ol></figure>;
}
