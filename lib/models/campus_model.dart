// This class represents a Campus in our application.
//
// A "model" is a Dart class that represents some data.
// In this case, CampusModel represents information about
// a university campus.
// 'final' means these values cannot be changed after
  // the object has been created.
  //
  // Example:
  // CampusModel campus = CampusModel(...);
  //
  // campus.name = "New Name"; // ❌ Not allowed

class CampusModel {
  final String id;
  final String name;
  final String code;
  final String description;
  final String academicFocus;
  final bool deliveryAvailable;

  const CampusModel({
    required this.id,
    required this.name,
    required this.code,
    required this.description,
    required this.academicFocus,
    required this.deliveryAvailable,
  });
 // Converts JSON data from an API into a CampusModel object.
  factory CampusModel.fromJson(Map<String, dynamic> json) {
    return CampusModel(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      description: json['description'] as String,
      academicFocus: json['academicFocus'] as String,
      // If the API doesn't provide this value, use true as the default
      deliveryAvailable: json['deliveryAvailable'] as bool? ?? true,
    );
  }
   // Converts a CampusModel object into JSON,
  // usually when sending data to an API or saving it.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'description': description,
      'academicFocus': academicFocus,
      'deliveryAvailable': deliveryAvailable,
    };
  }
 // Creates a new CampusModel while keeping the old values
  // for any fields that were not changed.
  CampusModel copyWith({
    String? id,
    String? name,
    String? code,
    String? description,
    String? academicFocus,
    bool? deliveryAvailable,
  }) {
    return CampusModel(
      // ?? means "use the new value if provided,
      // otherwise keep the existing value."
      id: id ?? this.id,
      name: name ?? this.name,
      code: code ?? this.code,
      description: description ?? this.description,
      academicFocus: academicFocus ?? this.academicFocus,
      deliveryAvailable: deliveryAvailable ?? this.deliveryAvailable,
    );
  }
}