# Record payments, produce receipts and correct mistakes

This guide is for cashiers and authorized managers. Your branch must have
approved payment methods, tax/charge rules and receipt setup. Financial
corrections may need permissions, a reason, manager approval and the original
payment or invoice. Never create another sale as a shortcut for investigating
an uncertain payment.

## Cash and split tender

Open the payment sheet from the intended order and read the total due. Select
**Cash**, enter the amount actually received, and check the displayed change.
For example, if the total is 1,850 in the branch currency and the customer gives
2,000, verify that the change is 150 before completing the sale. A permitted
cash-drawer action depends on its configured hardware; a successful sale is
not proof that the drawer physically opened.

When a customer deliberately uses more than one method, add each tender line
with its actual amount and check the remaining due. A 600 cash payment and a
400 manually confirmed transfer cover a 1,000 bill only when the effective
charges and conversion also agree. Do not add a second payment just to make a
pending response disappear. Check the final payment breakdown before settling.

## Manually recorded card, wallet and transfer payments

Methods named Card, bank transfer, Easypaisa, JazzCash or a custom name may use
manual confirmation in your release. Staff confirm the payment through the
business's approved external process, then record it in RoPulse. A payer's
claim, typed reference or screenshot is not equivalent to verified receipt of
funds in the business account.

1. Confirm the external payment through the procedure supplied by your manager.
2. Select the matching effective method and enter the actual amount/currency.
3. Enter the required reference exactly. Read the configured length/character
   guidance and do not substitute a made-up value if validation fails.
4. Check any remaining due and method-dependent calculation, then settle once.
5. Inspect the completed order/payment result and preserve the original reference
   if a manager needs to reconcile it later.

Some custom methods have optional references; supplied optional values can
still be validated. Built-in methods may enforce a required reference. Ask a
manager to fix an incorrect policy instead of entering meaningless evidence.

Foreign tender must use the selected currency and the displayed conversion
rules. Read both tender and base amounts; the number of currency units given
is not interchangeable with the branch-currency amount recorded on the sale.

## Confirm payment before issuing the final receipt

After **Settle**, wait for the recorded success state and invoice reference.
If the connection fails during settlement, preserve the order and investigate
its state. Ask the manager to check the original order/payment transaction.
Taking payment again or starting a second invoice can duplicate the customer's
charge even if the first response never reached the screen.

The receipt is the document for the recorded sale. A pre-receipt or bill preview
can show an amount still due; it is not confirmation that the customer has paid.
Invoice numbers, order references and takeaway tokens serve different purposes.
Use the correct reference when handling a complaint or retrieving a document.

## Configure and retrieve receipts

Authorized managers use **Receipts** in Backoffice to review receipt setup,
scope, sections, language/messages, output defaults and publish checks. Check
whether you are editing the business default or a branch override. Preview a
representative restaurant or retail receipt before publishing, then print a
test on the real supported printer. A sample preview is useful for layout;
inspect an actual settled document to verify the sale's real values.

Use receipt history to find the original by its reference/date and available
filters. Open the stored document to inspect its sale-time items, totals and
payments. Use the supported output actions, such as a PDF download, authorized
reprint or enabled email receipt. A reprint remains a copy of the original
record; do not edit today's product settings to try to change it.

Read digital delivery status separately from the sale result. Queued, sent,
delivered and failed are different states. If email is unavailable, use the
supported print/PDF path and resolve channel setup with the manager. Do not
promise that unsupported SMS or WhatsApp delivery occurred.

## Void, complimentary item, refund and reversal

A void concerns an item/order action and can include a write-off decision. A
complimentary item records the business intentionally not charging the guest
under the supported restaurant flow. A refund returns value against a recorded
sale. A payment reversal relates to the original payment. These actions are
not interchangeable ways to reduce a report total.

For an open-order void, select the correct item, read the available void/write-off
choice, enter an accurate reason and obtain any required approval. When an
approval is requested, wait for a manager's decision and continue the original
action through its retry/complete control. Do not remove another item just to
make the total look right while waiting.

For a settled-sale refund or payment reversal, open the original order/invoice
or relevant refund/payment view. Confirm the products, remaining refundable
amount, original method, intended destination and reason. Submit through the
provided workflow and inspect its result. A request awaiting approval is not a
completed refund; an application record does not automatically prove a bank
has returned money through an external manual method.

Retail exchanges may combine a return and a replacement purchase under the
supported flow. Review the net difference and stock/credit result, and do not
assume an ordinary refund duplicates all exchange behavior. Follow the branch's
approved return policy and escalate an unavailable action.

## Investigate and reconcile

Managers can use **Payments Setup → Transactions** to inspect recorded payment
history and available exports. Use **Reconciliation** with the required access
to compare expected activity and supporting external/bank records. Match the
original order/invoice, method, currency, reference and amount; a similar amount
on the same day is not sufficient identification.

Preserve history and reasons when correcting a mismatch. If the app reports a
duplicate reference, conflicting state or already-processed action, inspect the
existing record before retrying. Continue with
[shifts and reporting](10-shifts-reports-and-audit.md) for closing checks.
