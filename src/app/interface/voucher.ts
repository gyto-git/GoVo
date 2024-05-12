export interface Voucher {
  id: Number[];
  o_namaVoucher: string;
  o_status: Number;
  o_stokVoucher: Number;
  o_foto: string;
  o_ambil: Number;
  o_klaim: Number;
  o_tanggalMulai: string;
  o_tanggalAkhir: string;
  o_deskripsi: string;
}

export interface Last {
  lat: string;
  lng: string;
}

export interface Mock {
  name: string;
}