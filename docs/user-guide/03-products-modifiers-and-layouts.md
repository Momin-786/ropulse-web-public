# Prepare products, modifiers and Register layouts

Use **Menu & Products** in Backoffice to maintain what the business sells. You
need the relevant catalog permission and the correct branch selected. Before
starting, prepare product names, categories, units, barcodes where relevant,
images, selling prices and the options customers may choose. A product record,
a selling price and a visible Register tile are related but separate settings.

## Organize categories and products

Create a small, sensible category structure before entering the full menu. A
restaurant might use Main dishes, Drinks and Desserts; a retailer might use
Grocery and Household. Use categories that staff can recognize quickly and
that will make sense when you review sales. Avoid creating several near-identical
categories to work around an item that is missing from the Register.

1. Open **Menu & Products**, review the existing categories, and use the category
   add/edit action where needed. Check the parent/category relationship shown
   by the form before saving.
2. Start the product form and enter its name and the identifiers your operation
   uses. For retail, check the barcode/SKU against the physical product; two
   different products should not accidentally share one scan identifier.
3. Assign the appropriate category and configure the available product type,
   variants, units, tax associations, and applicable order types.
4. Add a supported image if useful. A clear image can help staff distinguish
   similar dishes, but an uploaded picture does not change the selling price.
   Follow the upload validation shown by the form rather than renaming a file
   extension to bypass an unsupported image format.
5. Save and reopen the product to check the stored result. Complete its branch
   availability and active price before testing it in the Register.

Variants distinguish versions of a product, such as size or packaging. Review
which identifier, price and stock unit applies to each version. A label such as
“Large” must represent the actual variant the cashier should sell; changing a
visible tile label alone does not change the underlying variant.

## Configure modifiers and combinations

Modifiers represent choices attached to a product, such as an extra topping or
a sauce. A modifier group may require a minimum number of choices and impose a
maximum. Decide whether the customer must choose, whether additional choices
cost extra, and which products should offer the group.

Open the modifier-group area, create or edit the group, add the relevant options,
and set the available selection rules and option prices. Attach the group to
the product through the catalog workflow. Then test the product in the Register:
the selection sheet should prevent an incomplete required choice and show the
price effect before the item is added.

For example, “Choose a side” might require one option, while “Extra sauces” may
allow zero to two. Do not make a zero-choice optional group mandatory merely
to display it on screen. If the product is a combo, review its slots and the
eligible products/variants for each slot. A cashier should be able to complete
every required slot without selecting an unavailable item.

The expected result is a cart line containing the chosen product and its actual
options. A free-text note such as “add cheese” is not a substitute for a priced
modifier when the business charges for that extra.

## Control branch and order-type availability

Check branch overrides when one outlet should hide a product or use different
selling settings. Distinguish a change to the shared product from a branch-only
override. Likewise, a product may be offered for takeaway but not delivery.
The Register's applicable order type and branch rules decide what staff see.

If an item appears in the catalog but not on the Register, check its active
status, branch visibility, order-type applicability, active price, category
placement and published layout. Do not create a second product as the first
troubleshooting step; that can split sales and stock history.

## Publish a usable Register layout

Open **POS Layouts** for the selected branch. Choose the supported presentation
and orientation, organize categories, and add the product tiles your staff need.
Use meaningful labels and ordering. If custom colors or images are available,
use them to aid recognition without making the label unreadable.

1. Add or rearrange the intended categories and tiles in the designer.
2. Select the correct product/variant for each tile and check its visibility
   for the relevant order types.
3. Preview the intended device orientation and view mode. Keep essential order
   actions reachable rather than filling every available area with products.
4. Save/publish using the designer's available action and wait for confirmation.
5. Open the actual Register for that branch, refresh/reconnect through its
   supported flow, and test the tile, modifier choices and price.

A published layout is shared operating configuration. It is not a local cashier
preference and it does not guarantee an offline device has already received
the latest version. Have the manager confirm that affected Registers can see
the update before announcing a new menu to customers.

When import/export is available, review the provided format before importing a
large catalog. Start with a small representative set and inspect categories,
identifiers and prices afterwards. Exported product data should be handled as
business information. For ingredients and recipes, continue with
[stock and recipes](09-stock-ingredients-and-recipes.md).
