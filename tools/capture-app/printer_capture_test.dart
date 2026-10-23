import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ropulse_api_client/ropulse_api_client.dart';
import 'package:ropulse_backoffice/ropulse_backoffice.dart';
import 'package:ropulse_design_system/ropulse_design_system.dart';
import 'support/harness.dart';

// Actual application widgets with in-memory demo repositories. No print, scan,
// retry, reprint or network send is performed. Network entries are local settings.
void main() {
  setUpAll(() async {
    final bytes = await File('${Platform.environment['WINDIR']}/Fonts/segoeui.ttf').readAsBytes();
    for (final family in ['Roboto', 'Segoe UI', 'Ahem', 'Inter', 'Manrope']) {
      await (FontLoader(family)..addFont(Future.value(ByteData.sublistView(bytes)))).load();
    }
    await (FontLoader('MaterialIcons')..addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'))).load();
    final mono = await File('${Platform.environment['WINDIR']}/Fonts/consola.ttf').readAsBytes();
    await (FontLoader('monospace')..addFont(Future.value(ByteData.sublistView(mono)))).load();
  });
  ThemeData captureTheme() {
    final theme = RoTheme.light();
    ButtonStyle readable(ButtonStyle? style) => (style ?? const ButtonStyle()).copyWith(textStyle: WidgetStateProperty.resolveWith((states) => (style?.textStyle?.resolve(states) ?? const TextStyle()).copyWith(fontFamily: 'Segoe UI')));
    return theme.copyWith(textTheme: theme.textTheme.apply(fontFamily: 'Segoe UI'), primaryTextTheme: theme.primaryTextTheme.apply(fontFamily: 'Segoe UI'),
      filledButtonTheme: FilledButtonThemeData(style: readable(theme.filledButtonTheme.style)),
      outlinedButtonTheme: OutlinedButtonThemeData(style: readable(theme.outlinedButtonTheme.style)),
      textButtonTheme: TextButtonThemeData(style: readable(theme.textButtonTheme.style)),
      chipTheme: theme.chipTheme.copyWith(labelStyle: (theme.chipTheme.labelStyle ?? const TextStyle()).copyWith(fontFamily: 'Segoe UI')));
  }
  Future<void> frames(WidgetTester tester) async {
    for (var frame = 0; frame < 5; frame++) {
      await tester.pump(const Duration(milliseconds: 300));
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 100)));
    }
    expect(tester.takeException(), isNull);
  }
  Future<void> reveal(WidgetTester tester, Finder finder) async {
    expect(finder, findsAtLeastNWidgets(1));
    await Scrollable.ensureVisible(tester.element(finder.first), alignment: .08);
    await frames(tester);
  }
  for (final scene in ['receipt-setup', 'network-printer', 'logical-printer', 'kot-routing', 'device-bindings', 'kot-history', 'kot-details']) {
    testWidgets('printer manual capture: $scene', (tester) async {
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(const MethodChannel('net.nfet.printing'), (call) async {
        if (call.method == 'printingInfo') return <String, Object?>{'canPrint': false, 'canListPrinters': false, 'directPrint': false};
        throw StateError('Physical printing is forbidden in website capture: ${call.method}');
      });
      addTearDown(() => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(const MethodChannel('net.nfet.printing'), null));
      tester.view..physicalSize = const Size(1440, 1000)..devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      final sessions = await signedInSessions();
      final scope = RoBranchScope(RoInMemorySecureStore());
      final branches = RoBranchController(repository: RoStubBranchRepository(), sessions: sessions, scope: scope);
      final menu = RoMenuController(repository: RoStubMenuRepository(latency: Duration.zero));
      final hardware = RoHardwareController(repository: RoStubHardwareRepository(), menu: menu);
      final storage = RoInMemorySecureStore();
      final printer = RoSystemReceiptPrinter(storage: storage, storageScope: 'website-demo');
      final bindings = RoKotPrinterBindingsController(storage: storage, storageScope: 'website-demo');
      final operations = RoKotOperationsController(repository: RoStubKotPrintQueueRepository(), idempotencyKeyOf: () => 'website-demo');
      late RoReceiptCenterController receipts;
      await tester.runAsync(() async {
        await branches.resolve();
        debugPrint('capture fixture: branches loaded');
        await scope.select(branches.state.branches.first, remember: false);
        await menu.resolve(); await hardware.resolveBranch('branch-1');
        debugPrint('capture fixture: hardware loaded');
        await printer.initialize();
        debugPrint('capture fixture: local printer initialized');
        await printer.addNetworkPrinter(name: 'Demo counter - example only', host: '192.0.2.50');
        final counterId = printer.selectedPrinterId;
        await printer.addNetworkPrinter(name: 'Demo kitchen - example only', host: '192.0.2.51');
        await bindings.initialize();
        await bindings.setBinding(logicalPrinterId: hardware.printers.first.id, localPrinterId: printer.selectedPrinterId);
        if (scene == 'receipt-setup' || scene == 'network-printer') await printer.selectPrinter(counterId);
        await operations.resolve('branch-1');
        debugPrint('capture fixture: KOT jobs loaded');
        receipts = RoReceiptCenterController(repository: RoStubReceiptManagementRepository(), settings: RoStubSystemSettingsRepository(), branchIdOf: () => 'branch-1', localPrinter: printer);
        await receipts.resolve();
        debugPrint('capture fixture: receipt workspace loaded');
      });
      final key = GlobalKey();
      final receiptScene = scene == 'receipt-setup' || scene == 'network-printer';
      await tester.pumpWidget(RepaintBoundary(key: key, child: MaterialApp(debugShowCheckedModeBanner: false, theme: captureTheme(), home: RoBackofficeShell(
        location: receiptScene ? '/receipts' : '/hardware', onNavigate: (_) {},
        branchSwitcher: RoBranchSwitcher(controller: branches, scope: scope),
        staff: const RoStaffSummary(id: 'demo-manager', displayName: 'Demo manager'),
        child: receiptScene ? RoReceiptCenterScreen(controller: receipts, branches: branches) : RoHardwareScreen(branches: branches, controller: hardware, kotOperations: operations, kotPrinterBindings: bindings, receiptPrinter: printer, canReprintKot: true, canCancelKot: true),
      ))));
      await frames(tester);
      if (receiptScene) {
        await tester.tap(find.text('Preview & Test')); await frames(tester);
        await reveal(tester, find.text('Printer on this register'));
        if (scene == 'network-printer') {
          await reveal(tester, find.text('Add network printer'));
          await tester.tap(find.text('Add network printer')); await frames(tester);
          final fields = find.descendant(of: find.byType(AlertDialog), matching: find.byType(TextField));
          await tester.enterText(fields.at(0), 'Demo kitchen - example only');
          await tester.enterText(fields.at(1), '192.0.2.51');
          await frames(tester);
        }
      } else if (scene == 'logical-printer') {
        await tester.tap(find.text('Add printer')); await frames(tester);
        final fields = find.byType(TextField);
        await tester.enterText(fields.at(0), 'Hot Line');
        await tester.enterText(fields.at(1), 'HOT-LINE');
        await tester.enterText(fields.at(2), 'Main kitchen pass');
        await tester.tap(find.text('Not assigned')); await frames(tester);
        await tester.tap(find.text(hardware.devices.firstWhere((device) => device.active).deviceCode).last); await frames(tester);
      } else if (scene == 'kot-routing') {
        await reveal(tester, find.text('KOT routing'));
      } else if (scene == 'device-bindings') {
        await reveal(tester, find.textContaining('kitchen printer bindings'));
      } else {
        await reveal(tester, find.text('Details').first);
        if (scene == 'kot-details') {
          await tester.tap(find.text('Details').first); await frames(tester);
        }
      }
      expect(find.byType(CircularProgressIndicator), findsNothing);
      await tester.runAsync(() async {
        final boundary = key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
        final image = await boundary.toImage(); final data = await image.toByteData(format: ui.ImageByteFormat.png);
        await Directory('output/printer-manual').create(recursive: true);
        await File('output/printer-manual/$scene.png').writeAsBytes(data!.buffer.asUint8List()); image.dispose();
      });
      await tester.pumpWidget(const SizedBox.shrink());
      for (final controller in [receipts, operations, bindings, printer, hardware, menu, branches]) { controller.dispose(); }
      sessions.dispose();
    });
  }
}
