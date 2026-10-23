import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ropulse_api_client/ropulse_api_client.dart';
import 'package:ropulse_backoffice/ropulse_backoffice.dart';
import 'package:ropulse_biometric/ropulse_biometric.dart';
import 'package:ropulse_design_system/ropulse_design_system.dart';
import 'support/harness.dart';

// Website captures of real app widgets. Every repository is a local demo stub;
// no tenant/network authentication or production mutations are involved.
void main() {
  ThemeData readableTheme() {
    final theme = RoTheme.light();
    ButtonStyle readable(ButtonStyle? style) => (style ?? const ButtonStyle()).copyWith(textStyle: WidgetStateProperty.resolveWith((states) => (style?.textStyle?.resolve(states) ?? const TextStyle()).copyWith(fontFamily: 'Segoe UI')));
    return theme.copyWith(textTheme: theme.textTheme.apply(fontFamily: 'Segoe UI'), primaryTextTheme: theme.primaryTextTheme.apply(fontFamily: 'Segoe UI'),
      filledButtonTheme: FilledButtonThemeData(style: readable(theme.filledButtonTheme.style)),
      outlinedButtonTheme: OutlinedButtonThemeData(style: readable(theme.outlinedButtonTheme.style)),
      textButtonTheme: TextButtonThemeData(style: readable(theme.textButtonTheme.style)),
      elevatedButtonTheme: ElevatedButtonThemeData(style: readable(theme.elevatedButtonTheme.style)),
      chipTheme: theme.chipTheme.copyWith(labelStyle: (theme.chipTheme.labelStyle ?? const TextStyle()).copyWith(fontFamily: 'Segoe UI')));
  }
  setUpAll(() async {
    final data = await File('${Platform.environment['WINDIR']}/Fonts/segoeui.ttf').readAsBytes();
    for (final family in ['Roboto', 'Segoe UI', 'Ahem', 'Inter', 'Manrope']) {
      await (FontLoader(family)..addFont(Future.value(ByteData.sublistView(data)))).load();
    }
    await (FontLoader('MaterialIcons')..addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'))).load();
  });
  for (final name in ['dashboard', 'staff', 'products', 'customers', 'stock', 'reports', 'hardware', 'payments', 'shifts', 'orders']) {
    testWidgets('website demo capture: $name', (tester) async {
      tester.view..physicalSize = const Size(1440, 1000)..devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      final sessions = await signedInSessions();
      final scope = RoBranchScope(RoInMemorySecureStore());
      final branches = RoBranchController(repository: RoStubBranchRepository(), sessions: sessions, scope: scope);
      final menu = RoMenuController(repository: RoStubMenuRepository(latency: Duration.zero));
      final staff = RoStaffController(repository: RoStubStaffRepository(latency: Duration.zero), sessionRepository: RoStubSessionRepository(latency: Duration.zero));
      final customers = RoCustomersController(repository: RoStubCustomerRepository(latency: Duration.zero));
      final dashboard = RoDashboardController(repository: RoStubDashboardRepository());
      final reports = RoReportsController(repository: const RoStubReportRepository());
      final stock = RoStockController(repository: RoStubStockRepository(), menu: menu);
      final hardware = RoHardwareController(repository: RoStubHardwareRepository(), menu: menu);
      final payments = RoPaymentsController(repository: RoStubPaymentRepository());
      final shifts = RoShiftsController(repository: RoStubShiftRepository());
      final orders = RoOrdersController(repository: RoStubOrderRepository());
      await tester.runAsync(() async {
        await branches.resolve();
        await scope.select(branches.state.branches.first, remember: false);
        await menu.resolve();
        await staff.resolve();
        await customers.resolve();
        await dashboard.load();
        await reports.resolve();
        await stock.resolveBranch('branch-1');
        await hardware.resolveBranch('branch-1');
        await payments.resolveBranch('branch-1');
        await shifts.resolveBranch('branch-1');
        await orders.resolve(branchId: 'branch-1');
      });
      final Widget screen = switch(name) {
        'dashboard' => RoDashboardScreen(controller: dashboard),
        'staff' => RoStaffScreen(controller: staff, biometricReader: const RoUnavailableBiometricReader(), tenantId: 'demo-business'),
        'products' => RoMasterMenuScreen(controller: menu, branches: branches),
        'customers' => RoCustomersScreen(controller: customers),
        'stock' => RoStockScreen(branches: branches, controller: stock),
        'reports' => RoReportsScreen(controller: reports),
        'hardware' => RoHardwareScreen(branches: branches, controller: hardware),
        'payments' => RoPaymentsScreen(branches: branches, controller: payments),
        'shifts' => RoShiftsScreen(branches: branches, controller: shifts, staff: staff),
        'orders' => RoOrdersScreen(branches: branches, controller: orders),
        _ => throw StateError(name),
      };
      final route = switch(name) { 'products' => '/menu', 'stock' => '/retail', _ => '/$name' };
      final key = GlobalKey();
      await tester.pumpWidget(RepaintBoundary(key: key, child: MaterialApp(
        debugShowCheckedModeBanner: false, theme: readableTheme(),
        home: RoBackofficeShell(location: route, onNavigate: (_) {},
          branchSwitcher: RoBranchSwitcher(controller: branches, scope: scope),
          staff: const RoStaffSummary(id: 'demo-manager', displayName: 'Demo manager'), child: screen),
      )));
      // Some management screens retain an animated indicator. Advance a bounded
      // set of frames, allowing demo repository timers to finish, then inspect.
      for (var frame = 0; frame < 6; frame++) {
        await tester.pump(const Duration(milliseconds: 500));
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 100)));
      }
      expect(tester.takeException(), isNull);
      expect(find.byType(CircularProgressIndicator), findsNothing);
      await tester.runAsync(() async {
        final boundary = key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
        final image = await boundary.toImage();
        final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
        await Directory('output/backoffice-captures').create(recursive: true);
        await File('output/backoffice-captures/$name.png').writeAsBytes(bytes!.buffer.asUint8List());
        image.dispose();
      });
      await tester.pumpWidget(const SizedBox.shrink());
      for (final controller in [branches, menu, staff, customers, dashboard, reports, stock, hardware, payments, shifts, orders]) { controller.dispose(); }
      sessions.dispose();
    });
  }
}
