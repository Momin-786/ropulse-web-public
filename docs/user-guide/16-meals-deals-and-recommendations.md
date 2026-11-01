# Meals, deals and cashier recommendations

RoPulse can prompt the cashier to offer a meal when a suitable main is selected. A meal can be built from ordinary menu items even if the restaurant has not created a combo. A matching configured combo can also be recommended as a deal. Nothing is added automatically: the cashier asks the customer, chooses the required options, reviews the updated order total and confirms.

The screenshots below show the current RoPulse Flutter interface with a demonstration menu. Product names and prices are examples. Set up recommendations in desktop Back Office; cashiers use them in Register. The browser billing/setup portal is not the meal configuration screen.

## Before you begin

Use an owner or authorized manager account to prepare the branch. Make sure the Register is paired to that same business and branch, its menu has finished loading, and the matching meal-enabled application/server update is installed. When the meal settings cannot load, use **Retry** before making changes. Do not recreate products or clear a register's saved orders to make the page appear.

For a first setup, prepare at least one eligible main and one ordinary extra. A useful small demonstration menu is a chicken sandwich, seasoned fries and fresh lime. Give each product its normal price and its correct tax treatment. If you offer different prices for dine-in and takeaway, complete both price lists. Assign the kitchen station for each product before testing kitchen output.

Decide which categories actually mean mains, sides and drinks in your menu. A modifier such as ketchup remains a modifier; it should not be classified as a drink simply to fill a selection. Use product exceptions if your categories mix several kinds of product.

## Prepare the menu

Create the ordinary products, their variants and modifier groups, branch availability, prices for the relevant order types, taxes and kitchen routes before enabling recommendations. Products classified as drinks should contain actual drinks. RoPulse uses your category and product assignments; it does not classify products by guessing from their names. A sauce category is not a drink category unless an owner explicitly assigns that role.

A configured deal must be a real combo with choice slots. The slot options must link to the actual component products. For example, a sandwich deal should have a main slot containing that sandwich, a side slot containing the available sides, and a drink slot containing the available drinks. Merely using the word “sandwich” in a deal name does not make it a match. A selected main variant is not offered a preset deal when the combo has no exact variant mapping; it can remain in the ordinary meal builder.

## Enable the branch

In desktop Back Office, select the intended branch, open **Branch settings**, scroll to the related setup links and press **Manage upsell rules**. The **Meals & recommendations** page has **Meal setup** and **Also add rules** tabs. Use **Meal setup** for this feature; the other tab keeps the existing add-on pairing workflow.

Turn on **Enable meal offers**, then select the eligible main, side and drink categories. Use **Individual product exceptions** when a category contains a product that should be excluded, or when a single product should be included without selecting its whole category. “Category” follows the category selections; “Include” or “Exclude” overrides them for that product and role.

![Back Office meal setup with separate main, drink and side category selections](/images/product/meals/01-backoffice-meal-setup.png "Select the actual main, drink and side categories for the selected branch, then save the setup.")

For the demonstration menu, select **Sandwiches** under eligible main categories, **Drinks** under drink categories and **Sides** under side categories. The same list of categories appears in each section so you can assign the correct role explicitly. A selected chip represents an assignment for that section, not a command to move or rename the category.

To make an exception, expand the product under **Individual product exceptions**. Each role has a selector. Leave **Category** to inherit the category assignment, choose **Include** to allow that product for the role, or choose **Exclude** to prevent it from appearing for the role. For example, exclude a bottled sauce from DRINK even if it currently sits in a broad beverages-and-extras category. An exception changes eligibility; it does not change the item's menu price.

Leave **Recommend matching configured deals** enabled to discover valid combos automatically. The generic builder does not require any combos. **Open the meal prompt automatically** controls whether the builder opens as a prompt or remains a visible cashier action. Turning off automatic prompts keeps the offer area available.

Use **Recommendation rules** to select a main and a recommended deal or extra. A hidden rule suppresses that recommendation for the selected main. Higher priority values appear first. A rule can have its own automatic prompt. The existing **Also add rules** tab remains available for the earlier ordinary add-on rules.

Press **Save meal setup**. Settings are versioned separately from the rest of the branch settings. If another manager saves first, refresh and review their changes before saving again. New registers expose the feature only when their server reports the matching meal capability; an older server must be upgraded first.

Before leaving the page, scroll to **Cashier preview** and select a main. If the product has sizes, choose the size you want to preview. The preview uses your current unsaved selections, so you can check the recommendation before committing the policy. It previews eligibility, rather than a customer's final order price. A missing offer means you should check the product roles, item availability and deal choices before enabling automatic prompts.

![Back Office cashier preview showing the recommendation for the selected main](/images/product/meals/02-backoffice-cashier-preview.png "Choose a main in Cashier preview to check your current recommendation settings before saving.")

Save the policy after the preview is correct. Reload the Register's configuration before trying the change there. If you manage several branches, repeat this setup in each intended branch using the normal branch selector; saving one branch does not deliberately enable every restaurant.

## Take an order

Add the customer's main as usual, including its size, modifiers and notes. Select that line in the ticket. The visible offer area names the selected main and asks the cashier to speak to the customer. Choose **Make it a meal** for ordinary extras, or select a recommended configured deal.

![Register ticket with the visible Make it a meal offer for the selected sandwich](/images/product/meals/03-register-visible-meal-offer.png "Select the main in the ticket, then use its visible Make it a meal action. Ask the customer before adding extras.")

A practical counter conversation is: “Would you like fries and a drink with your sandwich?” Wait for the customer's answer. If they decline, use **No thanks**. If they agree, open the builder and ask which choices they want. The recommendation is a cashier prompt; it is not permission to add a charge without asking.

For a built meal, choose the main size if needed, a side and a drink. Extras with variants or required choices open the normal configuration task. “None” leaves that role empty. When the selected line contains several units, choose how many to upgrade; the remaining units stay as a separate ordinary line. The builder never consumes a drink or side that was already separately added to the cart.

![Register meal builder with seasoned fries and fresh lime selected](/images/product/meals/04-register-choose-meal-items.png "Choose the customer's side and drink. The original main stays the source of this upgrade.")

Selecting an item with required choices opens the familiar product configuration task. Finish its required size or modifier choices before returning to the meal. If you change a choice after checking the total, the old quote is discarded; check the total again. Cancelling this task discards the meal draft and leaves the existing ticket intact.

Press **Check total**. Review the current order total, updated order total, difference and any warnings. A built meal uses normal menu prices; it does not invent a meal discount. A configured deal uses its combo pricing, with included component descriptions carrying no additional charge. Taxes and applicable supported pricing rules are included in the reviewed total.

![Meal confirmation showing the current total, updated total and difference](/images/product/meals/05-register-review-total.png "Review the complete change before pressing Confirm meal. These example prices do not add an extra meal discount.")

Press **Confirm meal** to apply the change. Cancel closes the draft without modifying the order. **No thanks** saves the dismissal for the selected source line and offer, so it can survive a restart and synchronize. Selecting a different main can show that main's recommendations.

### Worked example: keep a separately ordered drink

Suppose the ticket already contains one chicken sandwich at PKR 500 and one fresh lime at PKR 100. Its current total is PKR 600 in this example, which has no extra taxes or charges. Select the sandwich and build a meal with seasoned fries at PKR 150 and an additional fresh lime at PKR 100. The new total is PKR 850 and the increase is PKR 250.

After confirmation, the original fresh lime remains an independent order line. The sandwich, new fries and new fresh lime belong to the new meal. The customer's separately ordered drink is not silently reused to complete it. Check the actual quote in your business: taxes, variants, paid modifiers and applicable promotions can change the final figures.

If the customer instead selects a configured deal, review the deal's quote rather than adding the ordinary component prices yourself. The combo parent carries the configured deal charge; included component descriptions must not create a second charge for the same meal.

![The same meal review in dark mode](/images/product/meals/06-register-review-dark.png "The review and confirmation workflow is available in both light and dark modes.")

## Change or remove a saved meal

Saved member lines display their meal name. Select one to open the meal's group actions. **Edit meal** reopens its choices. **Remove entire meal** removes the group together. **Remove main · keep extras** removes the main and returns retained extras to ordinary menu pricing. Every group action requires a fresh reviewed total and confirmation.

![Saved meal actions for editing, keeping extras or removing the whole meal](/images/product/meals/07-register-saved-meal-actions.png "Use the meal's group actions rather than changing one included item independently.")

When the customer changes their mind, open the saved meal and choose the action that describes their request. Use **Edit meal** to change its options, then check and confirm the new total. Use **Remove main · keep extras** only when the customer still wants the extras at their ordinary prices. Use **Remove entire meal** when they no longer want any of that group. Review the new total for each action; a removal can change discounts or deal pricing as well as item quantities.

To pause service, use the normal **Hold** workflow and reopen the ticket through **Orders**. The saved meal and its group identity remain with the order. Before taking payment, confirm that all intended meal changes are visible and that any sync or confirmation warning has been resolved. Complete checkout through the normal payment flow and use the normal receipt/reprint controls afterward.

Ordinary quantity, price and removal actions cannot bypass group integrity. Changing the order type while a saved group exists requires removing/reviewing the meal first, so included deal components are not accidentally repriced as additional charged products. Items already sent to the kitchen remain subject to the existing amendment/void restrictions; reopening a draft is not permission to undo production already started.

## Offline operation and recovery

The register saves a confirmed meal change and its immutable sync command in one local transaction. Its operation identity and complete reviewed intent are retained for replay. A compatible paired Edge can share the provisional order with other registers; the cloud independently validates the order revision, policy, choices and commercial expectation before accepting it. Edge acceptance is not a confirmed cloud payment or fiscal settlement.

The first offline calculation requires a complete current order snapshot and cached branch policy, catalog and prices. The current offline calculator supports a new ordinary built meal for the complete selected main line. It preserves the main's existing configuration and adds discrete ordinary sides/drinks. It deliberately asks for reconnection for configured deal conversions, partial-unit splits, saved-meal edits/removals, main-size changes, sent-source changes, unsupported modifier storage, promotions or service charges that it cannot reproduce completely. The original order remains unchanged when that calculation is refused.

A cloud validation error does not trigger a guessed offline price. Network unavailability can use the supported local calculator; an explicit server rejection stays visible for correction. If prices or the order changed before replay, review the canonical order and its conflict details before reapplying. Never clear a payment conflict as a generic queue cleanup.

An interrupted direct confirmation displays **Check previous meal confirmation**. Use it to replay the saved identity. Do not create a second meal to guess whether the first succeeded. The original cashier may be required to recover their own operation. A definitive rejection means a new quote is needed; an unknown network result remains recoverable.

## Receipts and kitchen tickets

The customer receipt itemizes the charged products and tax amounts. A deal has one charged combo parent and included component descriptions; a built meal has its ordinary charged components. Group metadata is captured with the invoice so later menu or group edits cannot rewrite the issued receipt.

Kitchen jobs use the real component products and their category/station routes. A deal's billable parent is not an additional item for preparation. Kitchen lines retain the shared meal and component identifiers; the thermal KOT includes the meal reference so separate stations can associate their components. Reprints preserve those references. Printer connection and physical print acceptance are separate from the pricing and sync checks.

## Common questions during service

**Why is there no Make it a meal action?** Select an eligible main in the ticket. Then check that meal offers are saved for this branch, at least one eligible extra is available, and the Register has refreshed its configuration. A main already belonging to a saved meal uses that meal's group actions instead of a second upgrade prompt. An older application or server may also lack meal support; ask the owner to complete the matching update.

**Why is a particular deal missing?** A deal must contain the selected main through its real configured choice slots and be available for the branch, schedule and current selection. A similarly named deal is not enough. A selected size without an exact compatible mapping can remain eligible for an ordinary built meal while the preset deal stays hidden.

**Why does the total need checking again?** Changing the source, quantity, options or order invalidates the earlier review. Prices and other registers' order changes can also make it stale. Check the updated total, explain a changed price to the customer and confirm the new review. Do not repeatedly submit a new meal while a previous confirmation is uncertain.

**Can a cashier promise that the meal is synchronized?** Use the order's actual sync status. A local save or Edge acknowledgement means the change has been recorded at that stage; cloud acceptance is separate. If a conflict appears, read its details and review the latest order before taking a second payment or rebuilding the meal.

**How do we stop offering meals?** The owner can turn off **Enable meal offers** for the branch and save. Existing meals, order history and receipts still need to be readable. Finish or recover pending work through the normal Orders and sync controls rather than deleting it to hide the offer.
