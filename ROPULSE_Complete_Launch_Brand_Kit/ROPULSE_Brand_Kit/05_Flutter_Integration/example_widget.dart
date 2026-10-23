// Requires package:flutter_svg/flutter_svg.dart.
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class RopulseBrandHeader extends StatelessWidget {
  const RopulseBrandHeader({super.key, this.darkBackground = false});
  final bool darkBackground;
  @override
  Widget build(BuildContext context) => SvgPicture.asset(
    darkBackground
      ? 'assets/branding/ropulse-wordmark-with-tagline-light.svg'
      : 'assets/branding/ropulse-wordmark-with-tagline-dark.svg',
    width: 280,
    semanticsLabel: 'ROPULSE — A modern restaurant ordering pulse.',
  );
}
