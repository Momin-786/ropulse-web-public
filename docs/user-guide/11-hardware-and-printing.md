# Connect printers and print receipts and kitchen tickets

This guide explains what to install, how to connect a printer to the device running RoPulse, and how to check that customer receipts and kitchen order tickets reach the correct place. Complete setup on the actual till or print-station device that will be used during service. A printer working on a manager's laptop does not make it available automatically on every till.

You need a manager with hardware-management permission for branch printer records, routing and assignments. Cashiers may use the recovery and status actions allowed by their role. If an option is missing, ask a manager to check access rather than sharing another person's account.

## 1. Understand the two kinds of printing

| Output | What it does | What it does not mean |
| --- | --- | --- |
| Customer receipt | Shows the completed sale and its recorded payments. | Printing does not take a new payment. |
| Pre-receipt | Shows an unpaid, provisional bill for the customer to review. | It is not a paid receipt or tax invoice and does not settle the order. |
| Kitchen order ticket (KOT) | Tells a preparation area which items to make for an order and round. | It is not proof of payment. |
| PDF | Saves a document for viewing or supported system printing. | Saving a file does not prove that a physical printer produced paper. |

Receipt output and KOT routing are configured separately. A working receipt printer alone does not complete kitchen setup. KOT delivery needs all four links: a category routing rule, a logical kitchen printer, an assigned device that can process jobs, and a physical ESC/POS printer connection on that device.

## 2. Prepare before installation

Collect the printer's manufacturer and exact model, its supported connection type, paper width, the device operating system, and the printer's intended location. For a network printer, also obtain its IP address and configured printing port from the installer or printer configuration page.

Load the correct thermal paper with the printable side facing the print head, close the cover, connect power and run the printer's own self-test according to its manual. If that self-test is blank, incomplete or reports an error, resolve the printer problem before changing RoPulse settings.

Use the manufacturer-approved driver or setup utility for the exact model and operating system. Download it from the manufacturer's official support site or obtain it from your approved installer. There is no single driver that should be installed for every printer model.

### What needs to be installed?

| Connection or output | Preparation on the printing device |
| --- | --- |
| Windows system printer / PDF printing | Install the model's Windows driver when required, add the printer in Windows, and print a Windows test page. Select the matching printer in RoPulse. |
| Windows RAW ESC/POS | Set up a Windows printer queue for a compatible ESC/POS thermal printer. The printer and queue must accept raw ESC/POS bytes; an ordinary office or PDF queue is not a substitute. Confirm the printer is offered through the supported RoPulse transport before binding it for KOT. |
| Network ESC/POS | Configure the printer's network connection and address, and use a compatible native RoPulse app on a device that can reach it. Direct network printing does not itself require a Windows system queue. A vendor utility may be needed to configure the printer. |
| Android USB ESC/POS | Use a supported Android device, compatible USB printer and a suitable USB host/OTG connection. Allow the printer's USB permission request when shown. Installing a Windows driver on the tablet is not applicable. |
| Mobile Bluetooth ESC/POS | Use a compatible printer and the Bluetooth mode supported by the released app and operating system. Allow required Bluetooth/nearby-device permissions. Pair in operating-system settings if required by that model. |

Use only transports offered by your installed RoPulse version. The current native transport layer provides USB on Android/Windows, Bluetooth on Android/iOS, and network printing on native platforms; this is not a certification of every model or Bluetooth protocol. iOS printer compatibility in particular must be checked for the exact device/model combination. Do not assume a Bluetooth printer supported on Android also works on iOS.

Browser printing, when available in a released web app, uses browser/system capabilities. Do not assume a browser can access native USB, Bluetooth or raw TCP KOT connections. Use the supported native printing station for those connections. The RoPulse biometric bridge is for biometric readers; it is not a general printer driver and is not required merely to print a receipt or KOT. Do not install an unrelated service to work around a missing supported transport.

## 3. Connect a Windows printer

1. Install the manufacturer's driver for your printer model and Windows version if required. Follow the manufacturer's instructions on when to connect the USB cable.
2. Connect the printer directly or configure its approved network connection. Use a clear queue name such as `Counter Receipt` or `Kitchen Hot Line`.
3. Open Windows printer settings, confirm the queue is available, and print a test page. Resolve paused/offline queues, paper errors and driver failures here first.
4. Open RoPulse on this same computer and open **Receipt Center → Printer setup**. Refresh the printer list after installation.
5. Choose the intended output. A **System / PDF** destination is for rendered documents. A **Windows RAW** or other offered ESC/POS destination is used for compatible raw thermal output and KOT binding.
6. Select the matching paper format and print a RoPulse test copy. Check that the entire document fits the roll.

Do not replace a working driver with an arbitrary generic driver as a troubleshooting shortcut. If the printer appears only as System / PDF, use it for supported receipt output and have the installer establish a supported raw ESC/POS connection before using it for KOT.

## 4. Connect a network ESC/POS printer

1. Connect the printer to the branch's approved wired or wireless network. The till or print station must have a network route to the printer; guest Wi-Fi isolation can prevent access even when both devices have internet.
2. Obtain the printer's current IP address and raw printing port from its configuration page or installer. An address such as `192.168.1.50` is only an example, not a value to copy into your setup.
3. Arrange a stable address, such as a router DHCP reservation, with the network administrator. If the address later changes, the saved connection will need updating.
4. On the printing device, open **Receipt Center → Printer setup → Add network printer**.
5. Enter a recognizable name, the printer's actual host/IP address, and its port. The app defaults to **9100**, which is common for raw network ESC/POS, but use the port configured for your printer. Do not enter the RoPulse API address, a website URL, or the router's address.
6. Add the printer, select it as needed and print a test copy. Inspect the actual output before configuring it as a kitchen destination.

Keep the printer on the approved local network. Do not make its raw printing port publicly accessible on the internet. If your network requires a firewall change, ask the administrator to allow the necessary local connection rather than disabling the firewall.

## 5. Connect USB or Bluetooth on a supported mobile device

### Android USB

Power the printer independently if its hardware requires it. Connect it to the Android device using a compatible USB host/OTG adapter and cable. Open **Receipt Center → Printer setup** and use **Scan USB / Bluetooth** when that action is available. Accept the operating system's printer USB permission request, select the discovered USB printer, and print a test copy.

If discovery fails, check that the adapter supports USB host mode and that the cable carries data. A charging-only cable cannot provide a printer connection. Disconnecting and reconnecting may trigger a new permission request. Only grant access to the printer you intend to use.

### Bluetooth

Turn on the printer, keep it close to the printing device and follow its manual for the correct Bluetooth/pairing mode. If the manufacturer requires operating-system pairing, complete that first. Allow the app's required Bluetooth or nearby-device permission, then use **Scan USB / Bluetooth** in printer setup. Select the matching device and print a test copy.

If another till or vendor utility is holding the connection, disconnect it there before testing. A device appearing in a scan is not proof that its printing protocol is compatible. If the app does not offer Bluetooth on the current platform, use a supported connection instead.

## 6. Choose the receipt printer and paper

In **Receipt Center → Printer setup**, select the primary printer for this installation. Choose **58 mm** or **80 mm** for the actual thermal roll, or the supported document format for system/PDF output. A paper-width choice does not change the physical roll or convert an incompatible printer into a thermal printer.

If an approved spare printer is configured, select it as the fallback and test it separately. Receipt fallback, kitchen category fallback and a device's physical KOT fallback are different settings. Naming a spare in one place does not configure all three.

Print a test copy and inspect:

- Business/branch identity and readable logo, if configured.
- Long item names, quantities, modifiers and wrapping.
- Prices, discounts, charges, tax, currency, total, payment and change.
- Required receipt identifiers and QR/barcode legibility, where configured.
- The bottom of the receipt, margins and cutter/feed behavior supported by the printer.

After the test, complete an agreed training sale and verify the saved order/invoice and physical receipt. Do not rely on a preview or a successful spooler response as the only acceptance check. Local printer choices and connection details must be checked on each installation that prints.

## 7. Prepare kitchen destinations in Backoffice

A logical printer is the branch's named kitchen destination, such as **Hot Line** or **Drinks Bar**. It is a business routing record, not the USB cable, IP address or Windows queue. The physical connection is configured on the assigned device.

1. Sign in as a manager and select the correct branch. Open **Hardware & Printers**.
2. Add a logical kitchen printer. Enter **Printer name**, and useful **Station code** and **Location** values so staff can identify the destination.
3. Set **Assigned print-station device** to the approved active device that will deliver its tickets. A printer record left unassigned is not a completed station setup.
4. Set **Ticket paper width** to **58 mm thermal** or **80 mm thermal**, matching the actual printer.
5. Save and confirm the stored assignment. When editing, **Enabled for routing** is administrative availability; it is not a live printer heartbeat.

If a save reports an error after some changes were applied, refresh and inspect the stored printer and assignment before retrying. Do not assume the entire edit either succeeded or failed as one operation.

## 8. Route product categories to the kitchen

Open **KOT routing** for the branch. For each category that needs preparation, select its intended logical kitchen printer and, if required, an approved category fallback. Save the routing and review it again.

For example, **Burgers → Hot Line** and **Drinks → Drinks Bar** send different parts of one order to different preparation areas. Those names are examples; use your branch's actual categories and destinations. Check the product's stored category when an item goes to an unexpected area.

Check every category that should print. A printer name alone does not create a category routing rule. Changing a category fallback also does not create a local physical connection on the fallback station.

## 9. Bind logical printers to physical printers on the station

Do this on the assigned device after adding or discovering its printers in **Receipt Center → Printer setup**.

1. Open **Hardware & Printers → This device's kitchen printer bindings** with the required permission.
2. Find the logical destination, for example **Hot Line**.
3. Choose its **Physical printer** from the compatible local ESC/POS connections.
4. Set **Physical fallback** if this station has an approved alternative, and choose the actual **Paper** width.
5. Confirm the settings are saved. Repeat for every logical printer served by this device.

**System / PDF printers cannot print KOT bytes.** Use an offered USB ESC/POS, Bluetooth ESC/POS, Network ESC/POS or compatible Windows RAW destination. A virtual printer, when shown in a development build, is a simulator and produces no physical kitchen ticket.

The **Device default** choice uses this installation's selected printer. For a station serving several preparation areas, explicit bindings make the destination clearer and avoid later receipt-default changes redirecting kitchen output. Ensure any default used for KOT is itself a compatible ESC/POS destination.

Printer bindings stay on the device. Configuring them on a different laptop does not configure this station. If you reinstall the app, replace the device or change its printer connection, recheck the binding and permissions before service.

The station needs its approved RoPulse device identity, access to its assigned jobs and the appropriate print-station permission. A cashier's device-local job access does not grant branch-wide hardware management. Keep the supported station runtime available during service; do not assume a closed app, sleeping device or arbitrary browser tab continues to process jobs. If RoPulse says durable KOT delivery is waiting for backend activation, ask your administrator to complete the deployment rather than repeatedly sending the order.

## 10. Send an order and confirm the kitchen result

1. Create a clearly identified training order with an item from each routed category. Include a modifier, note and quantity that can be checked on paper.
2. Select the intended course where your service uses courses. Use the send control for unsent items or **Send courses to kitchen** for the selected course round.
3. Confirm that each intended preparation area receives the right items with the correct order/table or token, quantities, modifiers, notes and course information.
4. Open the available KOT status/history and compare its job/order/round references with the paper. Verify both the application status and the physical destination.
5. Add another item and send a new round. Confirm the new item reaches the kitchen and earlier items are not unintentionally sent for preparation again.

**Settle** sends remaining unsent items before opening checkout in the current app flow. That does not mean payment has already been taken, or that the printer has physically produced paper. If kitchen sending fails and checkout is blocked, resolve the reported sending problem and inspect the order before trying again.

Do not use repeated kitchen sends as a printer recovery technique. Once an item has been sent, investigate its existing KOT job. A reprint is an additional copy of a ticket and must be communicated to kitchen staff to prevent duplicate preparation.

## 11. Read KOT status and recover safely

Managers can inspect **KOT print queue & history**; ordinary devices may have a narrower status view. Use the available **Details** action to check the job, order, round, printer, assigned device, attempts and last-attempt information.

| Status shown | Meaning and next action |
| --- | --- |
| Routed / Pending | A job exists and awaits processing. Check assignment, station availability, local binding and connectivity. |
| Claimed / Printing | A station has taken responsibility or is sending the job. Check that station before creating another copy. |
| Printed | The transport/station reported a successful handoff. Inspect paper during installation or when staff report a missing ticket; not every printer can confirm physical output. |
| Not sent | Delivery failed before a successful send. Correct the connection problem and use the authorized retry action. |
| Check printer | Delivery is uncertain; some or all bytes may have arrived. Inspect the printer and ask the kitchen before choosing an authorized retry. |
| Failed | The job needs investigation. Read its details/error and involve a manager or support. |
| Unknown | The client cannot interpret the status. Record the job reference and seek support rather than assuming it printed. |

Fallback is safe automatically only when the system knows the original destination could not have received the output. An uncertain send can produce paper despite an error; a second send may duplicate it. After checking the physical output, use the permitted **Retry** or **Reprint** action and supply a reason when requested.

A **Cancellation ticket** tells the kitchen which previously sent items should no longer be prepared. Use it when authorized and appropriate, and confirm the kitchen has seen it. Creating a cancellation ticket does not itself void an order item, refund a payment or reverse the sale; perform those business actions separately through the order's permitted workflow.

## 12. Print a pre-receipt or another copy of a receipt

For an open order, use the header **Pre-receipt** action. The current app opens an **UNPAID** provisional bill preview with **Print** and **Save PDF**. Review it before handing it to a customer. Those actions do not settle the order. This preview uses system document output; it does not configure a raw KOT printer connection.

For a completed sale, find the original document in the available receipt/order history and use its authorized print or reprint action. Confirm the original invoice and payment first. Never settle the order again merely to obtain paper. Receipt delivery channels depend on branch configuration; do not assume SMS or WhatsApp delivery exists because a printer is configured.

## 13. Troubleshooting

| Problem | What to check |
| --- | --- |
| Printer not listed | Power/cable, driver or supported transport, operating-system discovery, permissions, and a refreshed RoPulse list. For network ESC/POS, add the actual address instead of expecting USB/Bluetooth scan to find it. |
| Windows test page fails | Fix the queue, driver, paper or connection first. RoPulse cannot repair a printer the operating system cannot use. |
| Network printer added but no paper | Check the printer's current IP/port, routing from this station, network isolation and compatible raw ESC/POS mode. Internet access alone does not prove local reachability. |
| USB printer not found on Android | Check USB host/OTG support, data cable, printer power and the USB permission request. |
| Bluetooth connects but cannot print | Check the exact model/protocol, permissions and whether another device owns the connection. Pairing alone does not prove ESC/POS compatibility. |
| Blank receipt | Run the printer's self-test and check thermal paper direction before editing receipt templates. |
| Cut-off text or excessive blank paper | Match 58/80 mm output and driver paper settings; inspect scaling/margins for system printing. Test a long receipt. |
| Garbled symbols or raw commands on paper | Check model compatibility, transport choice and driver/raw mode. An office/PDF destination must not be used as a raw KOT printer. |
| Receipt prints but no KOT | Check category routing, logical printer enabled state, assigned station, local ESC/POS binding, station permissions and KOT capability/job status. |
| Ticket goes to the wrong area | Check the item's category, category routing and the assigned station's physical binding; the display name alone is not sufficient. |
| Ticket prints twice | Inspect job IDs and attempt history, reprints, uncertain retries and physical fallback. Do not keep retrying while investigating. |
| Printer says ready but job remains pending | Enabled/configured is not a live delivery guarantee. Check the assigned station, runtime, authenticated device and job details. |
| Print fails after payment | Verify the original paid sale and retrieve its receipt. Repair output and reprint; do not take payment again. |
| Cash drawer does not open | Check whether the released integration and printer support drawer control, the drawer's approved connection and its own setup. Receipt printing alone does not guarantee drawer operation. |

If a problem persists, record the branch, station/device code, app version, operating system, exact printer model, connection type, order/invoice/job reference, time and displayed error. Include whether any paper appeared and whether the printer's self-test or operating-system test succeeded. Share those details with support; do not include passwords, tokens or customer payment-card details.

## 14. Daily opening and installation acceptance

Before service, check power, paper, spare rolls, covers, cables and station availability. Run the approved test on each receipt and kitchen destination after installation or any connection change. Confirm that pending/uncertain jobs from the previous service have been investigated before triggering retries.

The installer and branch manager should sign off these checks before relying on the setup:

- The exact printer model and connection were tested on the actual released app and station.
- Customer receipts fit the paper and show the correct totals and identifiers.
- Each routed category reaches the intended kitchen destination.
- Modifiers, notes, courses and a second round appear correctly.
- The approved fallback has been tested without an uncertain duplicate send.
- Staff can find job status and understand the difference between retry, reprint and sending a new round.
- A lost connection or paper fault can be recovered without creating another payment or duplicate preparation instruction.

This guide describes the current app's setup and recovery workflow. It does not certify a printer model, confirm a physical installation, or guarantee offline/background delivery for every device.

## Other supported peripherals

A keyboard-wedge barcode scanner behaves like typed input in the appropriate scan/search field. Test a known product and repeated scans, confirming quantities and input focus before service.

Biometric/card login requires a supported reader and the corresponding staff enrollment and access setup. Use the approved fallback login if unavailable; do not share another person's PIN. For a customer display, verify the released display mode, actual screen and configuration using non-sensitive training data. A connected monitor is not automatically a configured customer display.

For related service workflows, see [Restaurant service and the kitchen](06-restaurant-service-and-kitchen.md). For connectivity recovery, see [Connectivity and troubleshooting](12-connectivity-and-troubleshooting.md).
