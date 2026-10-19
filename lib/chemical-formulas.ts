// Base compound identities. These are not concentration, purity or hydrate specifications.
const formulas: Record<string, string> = {
  'Hydrochloric Acid': 'HCl', 'Sulphuric Acid': 'H₂SO₄', 'Nitric Acid': 'HNO₃', 'Acetic Acid': 'CH₃COOH',
  'Sodium Hydroxide': 'NaOH', 'Sodium Carbonate': 'Na₂CO₃', 'Sodium Bicarbonate': 'NaHCO₃',
  'Sodium Chloride': 'NaCl', 'Calcium Chloride': 'CaCl₂', 'Magnesium Chloride': 'MgCl₂',
  'Ferric Chloride': 'FeCl₃', 'Ferrous Chloride': 'FeCl₂', 'Aluminium Chloride': 'AlCl₃',
  'Zinc Chloride': 'ZnCl₂', 'Potassium Chloride': 'KCl', 'Ammonium Chloride': 'NH₄Cl',
  'Copper Chloride': 'Confirm Cu(I) / Cu(II)',
  'Ferrous Sulphate': 'FeSO₄', 'Zinc Sulphate': 'ZnSO₄', 'Magnesium Sulphate': 'MgSO₄',
  'Copper Sulphate': 'CuSO₄', 'Aluminium Sulphate': 'Al₂(SO₄)₃', 'Sodium Sulphate': 'Na₂SO₄',
  'Ammonium Sulphate': '(NH₄)₂SO₄', 'Manganese Sulphate': 'MnSO₄',
  'Mono Sodium Phosphate': 'NaH₂PO₄', 'Di Sodium Hydrogen Phosphate': 'Na₂HPO₄',
  'Tri Sodium Phosphate': 'Na₃PO₄', 'Mono Ammonium Phosphate': 'NH₄H₂PO₄', 'Di Ammonium Phosphate': '(NH₄)₂HPO₄',
  'Calcium Oxide': 'CaO', 'Magnesium Oxide': 'MgO', 'Zinc Oxide': 'ZnO',
  'Iron Oxide': 'Confirm oxide type', 'Copper Oxide': 'Confirm Cu(I) / Cu(II)',
  'Aluminium Oxide': 'Al₂O₃', 'Titanium Dioxide': 'TiO₂',
  'Poly Aluminium Chloride': 'Grade-specific polymer', 'Sodium Hypochlorite': 'NaClO',
  'Sodium Sulphide': 'Na₂S', 'Borax': 'Na₂B₄O₇ · nH₂O', 'Ammonium Bicarbonate': 'NH₄HCO₃',
  'Nickel Sulphate': 'NiSO₄', 'Cobalt Sulphate': 'CoSO₄',
};

export function chemicalFormula(name: string): string {
  return formulas[name.split(' (')[0]] || 'Confirm specification';
}
