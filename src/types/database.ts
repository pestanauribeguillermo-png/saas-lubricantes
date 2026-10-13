export type UserRole = 'admin' | 'mechanic' | 'cashier';

export interface Organization {
  id: string;
  name: string;
  ruc_nit?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  currency?: string | null;
  tax_percentage?: number | null;
  tax_name?: string | null;
  invoice_prefix?: string | null;
  receipt_footer?: string | null;
  whatsapp_template?: string | null;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id?: string | null;
  organization_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  commission_percentage: number;
  avatar_url?: string | null;
  is_active?: boolean;
}

export interface VehicleCatalog {
  id: string;
  brand: string;
  model: string;
  year_start: number;
  year_end?: number | null;
  engine: string;
  oil_viscosity: string;
  oil_type: string;
  crankcase_capacity_liters: number;
  filter_oil_code?: string | null;
  filter_air_code?: string | null;
  filter_cabin_code?: string | null;
  filter_fuel_code?: string | null;
  notes?: string | null;
}

export type ProductCategory =
  | 'Aceite de Motor'
  | 'Filtro de Aceite'
  | 'Filtro de Aire'
  | 'Filtro de Cabina'
  | 'Filtro de Combustible'
  | 'Líquido de Frenos'
  | 'Refrigerante'
  | 'Transmisión y Diferencial'
  | 'Aditivos y Limpiadores'
  | 'Servicio Mano de Obra';

export interface ProductPresentation {
  id: string;
  product_id: string;
  organization_id: string;
  name: string;
  factor_liters: number;
  price: number;
  barcode?: string | null;
  is_default?: boolean;
}

export interface Product {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  brand: string;
  category: ProductCategory;
  base_unit: string;
  stock_base: number;
  min_stock_alert: number;
  cost_price: number;
  selling_price_base: number;
  viscosity?: string | null;
  api_rating?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  presentations?: ProductPresentation[];
}

export interface Client {
  id: string;
  organization_id: string;
  full_name: string;
  document_id?: string | null;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ClientVehicle {
  id: string;
  client_id: string;
  organization_id: string;
  plate: string;
  brand: string;
  model: string;
  year?: number | null;
  color?: string | null;
  current_mileage: number;
  oil_recommendation?: string | null;
  last_service_date?: string | null;
  client?: Client;
}

export interface SaleItem {
  id?: string;
  sale_id?: string;
  organization_id?: string;
  product_id: string;
  presentation_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  factor_deducted: number;
  subtotal: number;
  product?: Product;
}

export interface Sale {
  id: string;
  organization_id: string;
  invoice_number: string;
  client_id?: string | null;
  vehicle_id?: string | null;
  cashier_id?: string | null;
  mechanic_id?: string | null;
  payment_method: 'cash' | 'card' | 'transfer' | 'credit';
  subtotal: number;
  tax: number;
  total: number;
  mechanic_commission_amount: number;
  status: 'completed' | 'cancelled' | 'draft';
  notes?: string | null;
  created_at?: string;
  items?: SaleItem[];
  client?: Client;
  vehicle?: ClientVehicle;
  mechanic?: Profile;
}

export interface ServiceHistory {
  id: string;
  organization_id: string;
  client_id: string;
  vehicle_id: string;
  sale_id?: string | null;
  service_date: string;
  current_mileage: number;
  next_change_mileage: number;
  next_change_date: string;
  oil_used?: string | null;
  filter_used?: string | null;
  observations?: string | null;
  mechanic_id?: string | null;
  whatsapp_reminder_sent: boolean;
  whatsapp_reminder_date?: string | null;
  status: 'scheduled' | 'due' | 'completed' | 'cancelled';
  client?: Client;
  vehicle?: ClientVehicle;
  mechanic?: Profile;
}
