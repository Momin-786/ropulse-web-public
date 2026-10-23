# Open and close shifts, review reports and investigate history

This guide is for staff handling a Register shift and managers responsible for
cash and operational review. Agree the physical cash-counting and handover
procedure before opening. Reports must be read with the right branch, date,
timezone and currency; a different selection can explain an apparent difference.

## Open a shift

Sign in on the correct prepared Register and open the shift control in its
header. If no shift is open, use the available **Clock in**/opening action.
Enter the actual opening cash where the form asks for it, along with any
required check-in information. Count the float rather than copying yesterday's
amount automatically.

Wait for the confirmed open state and inspect the shift shown in the header.
If a shift is already open unexpectedly, ask the responsible manager to inspect
it before creating or closing anything. The business may need to distinguish a
staff attendance action from a Register cash shift; follow the terminology and
records provided by your installed release.

## Record cash movements correctly

Sales, refunds and supported cash-drawer events contribute different types of
activity. Use the available cash movement action and an accurate reason for a
permitted non-sale event. Opening a drawer for inspection is not the same as
recording money added or removed. Do not create a fake sale to account for an
unrelated cash movement.

Keep physical supporting records according to the business's procedure. When
a manually recorded external payment is involved, its value should not be
counted as physical drawer cash simply because it was recorded at this Register.

## Close and hand over

1. Review open/held orders and any unresolved payments with the manager. Closing
   a shift should not hide an uncertain sale that still needs investigation.
2. Count the cash using the business's agreed method and identify any amounts
   that belong outside the drawer's expected sales/float calculation.
3. Open the shift closing action and enter the actual count and required notes.
4. Review expected versus counted values and any variance. If a discrepancy is
   real, record the explanation; do not change the count to force a zero variance.
5. Complete the permitted closing/approval flow and verify the recorded status.
   Pass unresolved issues and references to the next responsible person.

In Backoffice **Shift & Cash**, managers can open shift detail to review the
cash drawer, reconciliation, payment-method breakdown, cash events and handover
notes. Check sales, reversals and net figures in their proper context. An
external card terminal's bank settlement can include fees or different timing;
it should not be forced to equal a gross cash-drawer figure.

## Read the dashboard and reports

The **Dashboard** gives an overview such as sales indicators, trends, best-selling
products and exceptions where supported. Treat it as an entry point for
investigation. Use the underlying report/order/payment records for a detailed
reconciliation, and check whether the selected data finished loading.

In **Reports**, select the intended branch and period, then choose the relevant
report. The workspace includes supported views such as item/hour/day sales,
daily closing, budget comparisons, combo/delivery analysis, exceptions and
attendance. Read the available details and units before interpreting a total.

Reports can load independently. If one fails while another succeeds, use the
targeted retry for the failed report. A visible successful table is not evidence
that the complete report pack loaded. A date range that is too large may be
rejected; narrow it to the period you actually need.

Where budget entry is available, enter the intended branch-currency target and
date/context, save, and review the updated comparison. A target is a planning
figure, not an alteration to actual sales. When currencies differ, compare like
units; mixed-currency rows cannot automatically be added as one monetary total.

## Export data

Use **Columns** to choose the supported visible report details, then the
available **Export** action. Options include the current report as CSV/Excel
and a complete reports pack in one Excel sheet where supported. Confirm whether
the export contains your current selection or all requested reports.

If the app says some reports failed, retry them before calling an exported pack
complete. Inspect the resulting file's branch, dates, currency and totals. Store
exports securely: they can contain business performance and staff information.
Exporting a report is not a database backup.

## Use audit, void and approval history

Use **Void Log** to inspect voided activity with its reasons and linked order.
Use **Audit Log** to review the supported record of actions. Where anomaly
alerts appear, inspect the underlying records before concluding that someone
acted improperly; an alert is a reason to investigate, not a final finding.

For a discrepancy, begin with the original order or invoice reference and trace
its payment, correction, approval and shift context. Check the actor and time
alongside the amounts. Do not edit unrelated setup or delete records to make a
historical discrepancy disappear. Escalate with the relevant references and
the comparison you expected to match.
