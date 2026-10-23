# Review retail stock, ingredients and recipes

This guide is for authorized stock and catalog managers. Confirm the branch,
product and measurement unit before entering quantities. A retail product's
quantity on hand and a restaurant ingredient's recipe/cost are different
records. Use the workflow your business has enabled; do not assume that a stock
screen includes purchasing, supplier management or every inventory process.

## Read retail quantity on hand

Open **Retail Stock** for the intended retail branch. Find the product and read
its on-hand quantity and available update information. Check whether you are
looking at the correct product/variant and unit. A number of individual units
cannot be compared directly with a count of cartons without the business's
correct unit convention.

The expected value reflects recorded stock movements, not an automatic physical
count of the shelf. A difference can arise from unrecorded delivery, wastage,
wrong-product sale or incomplete reconciliation. Investigate the cause rather
than entering repeated corrections until the number looks familiar.

## Adjust stock by a difference

Use **Adjust** when you intend to record a change relative to the current
quantity. For example, adding 5 to a current quantity of 12 should produce 17
if no other movement intervenes. A negative adjustment can represent a supported
reduction under your business's approved process.

1. Select the correct product row and choose **Adjust**.
2. Enter the signed change in the unit expected by the form and an accurate
   reason where requested. Check the sign before submitting.
3. Save once and wait for confirmation. Reopen/refresh the product to inspect
   the resulting on-hand value.
4. If the response is uncertain, inspect the current value/history before
   entering the same movement again.

Do not use an adjustment to erase a legitimate sale or return. That sale's
financial correction belongs to the order/refund workflow.

## Set stock from a count

Use **Set**/**Set stock** when the business intends to record the absolute
counted quantity. Setting 17 means “the count is 17”, not “add 17”. Agree a
counting time and control sales/movements during the count so the physical
number and system action refer to the same stock position.

Count the product, check unit/variant, enter the final quantity and reason,
then save and inspect the result. If another person is also counting the same
product, coordinate before either person submits. A second absolute set can
overwrite the intended position of a later movement.

## Prepare restaurant ingredients

Use the ingredient/recipe area linked from the catalog. Create an ingredient
with the supported name, measurement unit and cost information. Keep units
consistent: a recipe using grams should not accidentally treat a kilogram cost
as a per-gram cost. Review ingredient details when purchase costs change, using
the business's approved cost-maintenance process.

Before adding a duplicate ingredient, search for an existing record with a
different spelling. Duplicate ingredients can split recipe costing and make
later review harder. Follow the available archive/edit policy instead of
reusing an old ingredient's identity for a different raw material.

## Build and check a recipe

Open the recipe list and select the intended product, or use the attach/build
action for a product without a recipe. Add the ingredient components and their
quantities in the expected units. Review the cost and any displayed comparison
with selling price/margin. Save, reopen and inspect the composition again.

For example, a recipe for one portion should describe that portion's ingredient
requirements. Do not enter a full batch quantity as a per-portion amount unless
the recipe form explicitly represents a batch/yield. Use the supported fields
and the business's agreed costing convention.

The missing-recipe filter helps identify products not yet covered. A product
without a recipe can still appear elsewhere in the catalog; it should not be
assumed to have a zero real cost. Recipe costing is not evidence that every
sale has already posted automatic ingredient consumption in the released
system. Confirm the enabled stock/consumption behavior with your onboarding
contact before relying on it for purchasing or waste decisions.

## Check a stock-related customer problem

If a cashier reports unexpected availability, compare the product's active and
branch availability settings with stock. A product can be hidden despite having
quantity, and an out-of-stock display may have a separate branch selling
policy. Use the actual message and selected branch to investigate.

Escalate with the product identifier/name, branch, expected and displayed
quantity, unit, approximate time and recent authorized actions. Avoid a
speculative series of adjustments; that makes the original difference harder
to trace.
