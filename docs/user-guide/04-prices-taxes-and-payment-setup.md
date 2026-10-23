# Configure prices, taxes, currencies and payment methods

This guide is for owners and managers preparing how sales are calculated and
recorded. Use the correct branch and the relevant pricing, payment and tax
permissions. Have your approved price list, base currency, applicable tax
instructions and accepted payment procedures ready. Your accountant or
responsible manager should approve tax treatment before real sales begin.

## Set and check selling prices

Open **Pricing** and select the relevant branch, products and pricing context.
Enter the intended amount and review any effective-date, variant and order-type
settings offered by the form. If the change needs approval, complete that
workflow rather than assuming that a submitted request is already active.
Bulk pricing helps apply a deliberate change across a selection; check the
selection and preview before saving so unrelated products are not changed.

After saving, test the product in the Register for the same branch and order
type. Check the amount displayed before and after modifiers and relevant
charges. A product with no usable active price may be unavailable for sale.
Publishing its tile does not create that price.

For example, a drink may have different dine-in and takeaway pricing. Check
both sale contexts rather than testing one and assuming the other is identical.
An old receipt retains its sale-time values; changing today's price is not a
correction to yesterday's invoice. Use the authorized correction workflow for
an incorrect recorded sale.

## Understand base currency and foreign tender

The branch's base currency is the currency in which its sale is calculated.
Foreign tender is money accepted in another configured currency and converted
under the branch's supported rate policy. Check the base currency and precision
before trading; changing a currency symbol does not convert stored amounts.

In **Payments Setup**, use the foreign-currency rate area to inspect or set a
supported rate. Read the conversion direction and units shown by the form.
When fixed/live modes are offered, choose the mode your business has approved
and review its effective time. Do not guess that a typed rate is the inverse
of the rate the app expects.

Test a small transaction with the expected conversion and inspect the displayed
base amount, tender amount and receipt evidence. Reports may contain different
currencies. Read the currency label beside each amount rather than adding rows
with different units. A missing-currency message needs investigation; it is not
an instruction to assume the amount is PKR.

## Configure tax and charges in their proper scope

Open **Tax & Compliance** to review the tax setup exposed for your account and
branch. Confirm product/category assignments, branch authorities and supported
rules with the responsible manager. Payment-related tax assignments belong to
the payment setup workflow where available. Service, delivery and packaging
charges are separate operating settings and should be reviewed with their
applicable order type.

Test the complete order rather than only the tax percentage field. Inspect
the subtotal, discounts, service/delivery charges, tax and final due amount.
The receipt should explain the result that was actually settled. A tax setup
screen does not by itself prove that an external fiscal service is connected;
use only the fiscal features explicitly enabled for your release.

## Prepare accepted payment methods

Open **Payments Setup** and use **Setup** to review the effective methods.
Decide which are accepted, at which branches, and which evidence staff must
enter. A method such as bank transfer, card or wallet can be recorded manually;
its presence does not establish an automatic connection to a bank or provider.
Tell cashiers exactly how they should verify receipt of money outside RoPulse.

For custom manual methods in a release where they are enabled:

1. Select **Add method** and enter a clear business name, such as “Business bank
   transfer”. Choose the appropriate category and display order.
2. Choose the offered reference mode: not required, optional, or required. For
   methods that collect a reference, provide a meaningful field label/help text
   and the permitted length and character rules.
3. Configure the selected branch's availability and accepted currencies. Check
   any tax associations in the related setup workflow.
4. Save and wait for the full result. Creation can include more than one setup
   step; an “incomplete setup” message must be resolved before the method is
   considered ready for cashiers.
5. Reload the effective method list and verify the method in the Register.
   Test both an acceptable reference and a value that should be refused.

Some built-in methods enforce mandatory evidence and cannot be edited or
archived through the custom-method controls. Respect the effective rule shown
by the app instead of assuming the owner's custom-method choice applies to
every built-in wallet or card method.

Tenant availability and branch availability are separate. A branch policy
cannot make a method usable while it is disabled for the business. Likewise,
enabling something business-wide can affect more than the currently selected
branch. Review the displayed scope and confirm the intended result at each
affected outlet.

If saving fails after a method has been created, inspect the disabled/incomplete
record and finish it through the edit workflow. Do not repeatedly add new
methods with slightly different names. When a method is no longer accepted,
disable/archive it through the supported action; its old transaction history
should remain readable with the original method name.

## Promotions and approval

Use **Promotions** to configure supported offers/coupons and their eligibility,
dates and scope. Test a qualifying and nonqualifying cart. An advertised discount
must match the actual branch/order conditions. Manual price overrides and
discounts may need a manager's permission or reason; configuration is not a
substitute for that approval.

The expected setup result is a cashier who sees only intended payment options,
understands the required evidence, and produces the expected total and receipt.
Continue with [Register and checkout](05-register-and-checkout.md).
