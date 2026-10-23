# Printer and KOT documentation handoff

Updated: 22 October 2026.

## Content ready for website implementation

The expanded user-facing chapter is [Connect printers and print receipts and kitchen tickets](user-guide/11-hardware-and-printing.md). It replaces the existing short hardware chapter at the same path, so existing documentation index links remain valid.

It covers prerequisites, what to install for each connection, Windows/system versus raw ESC/POS output, Android USB, mobile Bluetooth, network address/port setup, paper width, receipt tests, logical KOT destinations, category routing, device assignment, local physical binding, KOT job status, recovery, pre-receipts, reprints and installation acceptance. Existing scanner/reader/display guidance is retained briefly.

## Suggested website presentation

Keep this as the hardware chapter in the customer documentation. Use its numbered sections as the page table of contents. If the website splits it into child pages, preserve all instructions and cross-links under these headings:

1. Before you start and what to install.
2. Connect Windows, network, USB or Bluetooth printers.
3. Receipt output and paper settings.
4. Kitchen destinations, routing, station assignment and physical binding.
5. Send and verify KOTs.
6. Job status, retry, reprint and cancellation tickets.
7. Troubleshooting and opening checks.

Use the exact current app labels quoted in the chapter. Screenshots should come from the released build and show no customer details, credentials or production tokens. Useful screenshots are Receipt Center printer setup, Add network printer, logical printer creation/assignment, KOT routing, this-device bindings and KOT job details. No new screenshots or product UI changes are included in this documentation update.

## Claims that must remain accurate

- A logical destination is distinct from a local printer connection.
- System/PDF output cannot be used as a raw KOT binding.
- A successful transport response is not universal proof of physical paper output.
- Native transport support is not certification of all models or Bluetooth protocols.
- Browser printing must not be described as native USB/Bluetooth/raw-network support.
- The biometric bridge is not a printer driver.
- Do not promise an always-on print daemon, offline delivery or background execution merely because the app contains a print-station controller.
- A pre-receipt is unpaid. Printing or reprinting does not collect payment.
- A cancellation ticket does not itself void/refund the order.
- Do not turn the installation acceptance checklist into a statement that hardware has already been tested.

## Source review

Instructions were checked against the app workspace on 22 October 2026:

- `packages/ropulse_backoffice/lib/src/receipts/receipt_center_screen.dart`
- `packages/ropulse_backoffice/lib/src/pos_shell/receipt_printer.dart`
- `packages/ropulse_backoffice/lib/src/pos_shell/pre_receipt_preview.dart`
- `packages/ropulse_backoffice/lib/src/hardware/hardware_screen.dart`
- `packages/ropulse_backoffice/lib/src/hardware/kot_operations_panel.dart`
- `packages/ropulse_backoffice/lib/src/hardware/kot_print_station_controller.dart`
- `packages/ropulse_backoffice/lib/src/hardware/system_kot_job_dispatcher.dart`
- `packages/plugins/pos_printer_d/lib/src/printer_service.dart`

This is a documentation handoff only. The website implementer should wire the chapter into its content renderer/search when needed. The existing combined `docs/ROPULSE_PLATFORM_GUIDE.md` is a separate snapshot and has not been regenerated here; use the expanded chapter as the current source for hardware instructions.
