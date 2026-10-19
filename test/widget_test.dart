// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:aau_campus_market/main.dart';

void main() {
  testWidgets('AAU Campus Market app initializes properly', (WidgetTester tester) async {
    // Build our app inside a ProviderScope and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: AAUCampusMarketApp(),
      ),
    );

    await tester.pump();

    // Verify MaterialApp exists and renders the main screen shell or login
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
