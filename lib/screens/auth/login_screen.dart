import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/campus_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Student Controllers
  final _studentIdController = TextEditingController();
  final _studentPasswordController = TextEditingController();
  String? _selectedCampusId;
  bool _obscureStudentPass = true;

  // Admin Controllers
  final _adminEmailController = TextEditingController(text: 'admin@aau.edu.et');
  final _adminPasswordController = TextEditingController(text: 'Admin@123456');
  bool _obscureAdminPass = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _studentIdController.dispose();
    _studentPasswordController.dispose();
    _adminEmailController.dispose();
    _adminPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final campusState = ref.watch(campusProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 12),
              // App Logo & Header
              Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2E7D32).withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.storefront, size: 52, color: Color(0xFF2E7D32)),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'AAU Campus Market',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Addis Ababa University Official Portal',
                    style: TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Tab Selector: Student vs Admin
              Container(
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    color: const Color(0xFF2E7D32),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.grey.shade700,
                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  tabs: const [
                    Tab(icon: Icon(Icons.school, size: 20), text: 'Student Login'),
                    Tab(icon: Icon(Icons.admin_panel_settings, size: 20), text: 'Admin Portal'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Error display
              if (auth.errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline, color: Colors.red, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          auth.errorMessage!,
                          style: const TextStyle(color: Colors.red, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Tab Views
              SizedBox(
                height: 340,
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    // --- STUDENT TAB ---
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'AAU Registered Students Only',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.grey),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _studentIdController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Campus ID or Student Email',
                            hintText: 'e.g. UGR/1234/24 or student@aau.edu.et',
                            prefixIcon: Icon(Icons.badge_outlined),
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _studentPasswordController,
                          obscureText: _obscureStudentPass,
                          decoration: InputDecoration(
                            labelText: 'Password',
                            prefixIcon: const Icon(Icons.lock_outline),
                            border: const OutlineInputBorder(),
                            isDense: true,
                            suffixIcon: IconButton(
                              icon: Icon(_obscureStudentPass ? Icons.visibility_off : Icons.visibility),
                              onPressed: () => setState(() => _obscureStudentPass = !_obscureStudentPass),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          value: _selectedCampusId,
                          decoration: const InputDecoration(
                            labelText: 'Select AAU Campus',
                            prefixIcon: Icon(Icons.location_on_outlined),
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          items: campusState.campuses
                              .map((c) => DropdownMenuItem(value: c.id, child: Text(c.name)))
                              .toList(),
                          onChanged: (v) => setState(() => _selectedCampusId = v),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            backgroundColor: const Color(0xFF2E7D32),
                            foregroundColor: Colors.white,
                          ),
                          onPressed: auth.isLoading
                              ? null
                              : () async {
                                  if (_selectedCampusId == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Please select your AAU campus.')),
                                    );
                                    return;
                                  }
                                  await ref.read(authProvider.notifier).login(
                                        campusId: _studentIdController.text,
                                        password: _studentPasswordController.text,
                                        selectedCampusId: _selectedCampusId!,
                                      );
                                },
                          icon: auth.isLoading
                              ? const SizedBox(
                                  height: 18,
                                  width: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Icon(Icons.login),
                          label: const Text('Student Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),

                    // --- ADMIN TAB ---
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'AAU Administrator Access',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.grey),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _adminEmailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Administrator Email',
                            hintText: 'admin@aau.edu.et',
                            prefixIcon: Icon(Icons.admin_panel_settings_outlined),
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _adminPasswordController,
                          obscureText: _obscureAdminPass,
                          decoration: InputDecoration(
                            labelText: 'Admin Password',
                            prefixIcon: const Icon(Icons.lock_outline),
                            border: const OutlineInputBorder(),
                            isDense: true,
                            suffixIcon: IconButton(
                              icon: Icon(_obscureAdminPass ? Icons.visibility_off : Icons.visibility),
                              onPressed: () => setState(() => _obscureAdminPass = !_obscureAdminPass),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            backgroundColor: Colors.blueGrey.shade800,
                            foregroundColor: Colors.white,
                          ),
                          onPressed: auth.isLoading
                              ? null
                              : () async {
                                  // Default to Main Campus if none selected
                                  final campus = campusState.campuses.isNotEmpty ? campusState.campuses.first.id : 'main_campus';
                                  await ref.read(authProvider.notifier).login(
                                        campusId: _adminEmailController.text,
                                        password: _adminPasswordController.text,
                                        selectedCampusId: campus,
                                      );
                                },
                          icon: auth.isLoading
                              ? const SizedBox(
                                  height: 18,
                                  width: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Icon(Icons.security),
                          label: const Text('Admin Dashboard Login', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
