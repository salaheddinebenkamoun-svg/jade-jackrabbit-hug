export type PublicOptionId =
  | 't1'
  | 't2'
  | 't3'
  | 't4'
  | 'bw1'
  | 'bw2'
  | 'bus_lissasfa_nations_unies'
  | 'bus_hay_hassani_ain_sebaa'
  | 'bus_sidi_moumen_oulfa';

export interface TransitLine {
  id: PublicOptionId;
  mode: 'tramway' | 'busway' | 'bus';
  label: string;
  fareMad: number;
  averageSpeedKmh: number;
  headwayMinutes: number;
  path: [number, number][];
}

/**
 * Approximate operational corridors in Casablanca aligned with official public maps
 * from Casa Tramway / Casa Busway and Casabus communication materials.
 */
export const TRANSIT_LINES: TransitLine[] = [
  {
    id: 't1',
    mode: 'tramway',
    label: 'T1 · Sidi Moumen ↔ Lissasfa',
    fareMad: 6,
    averageSpeedKmh: 22,
    headwayMinutes: 7,
    path: [
      [33.6052, -7.5262],
      [33.5968, -7.5545],
      [33.5886, -7.5742],
      [33.5736, -7.5892],
      [33.5585, -7.6114],
      [33.5448, -7.6348],
      [33.5301, -7.6524],
    ],
  },
  {
    id: 't2',
    mode: 'tramway',
    label: 'T2 · Aïn Diab ↔ Sidi Bernoussi',
    fareMad: 6,
    averageSpeedKmh: 21,
    headwayMinutes: 8,
    path: [
      [33.5959, -7.7036],
      [33.5882, -7.6716],
      [33.5805, -7.6228],
      [33.5741, -7.5896],
      [33.5767, -7.5568],
      [33.5824, -7.5325],
      [33.5891, -7.5061],
    ],
  },
  {
    id: 't3',
    mode: 'tramway',
    label: 'T3 · Port de Casablanca ↔ Hay Hassani',
    fareMad: 6,
    averageSpeedKmh: 20,
    headwayMinutes: 9,
    path: [
      [33.6088, -7.6166],
      [33.5917, -7.6019],
      [33.5752, -7.5893],
      [33.5586, -7.6014],
      [33.5439, -7.6157],
      [33.5315, -7.6327],
    ],
  },
  {
    id: 't4',
    mode: 'tramway',
    label: 'T4 · Parc de la Ligue Arabe ↔ Mohammed V Airport axis',
    fareMad: 6,
    averageSpeedKmh: 20,
    headwayMinutes: 9,
    path: [
      [33.5916, -7.6189],
      [33.5814, -7.6044],
      [33.5702, -7.5896],
      [33.5572, -7.5798],
      [33.5432, -7.5713],
      [33.5287, -7.5646],
    ],
  },
  {
    id: 'bw1',
    mode: 'busway',
    label: 'BW1 · Salmia ↔ Lissasfa',
    fareMad: 6,
    averageSpeedKmh: 24,
    headwayMinutes: 8,
    path: [
      [33.6062, -7.5295],
      [33.5921, -7.5532],
      [33.5784, -7.5796],
      [33.5658, -7.6062],
      [33.5537, -7.6297],
      [33.5388, -7.6525],
    ],
  },
  {
    id: 'bw2',
    mode: 'busway',
    label: 'BW2 · Errahma ↔ Sidi Moumen',
    fareMad: 6,
    averageSpeedKmh: 23,
    headwayMinutes: 9,
    path: [
      [33.4865, -7.6604],
      [33.5174, -7.6468],
      [33.5442, -7.6261],
      [33.5669, -7.6029],
      [33.5846, -7.5755],
      [33.6002, -7.5462],
    ],
  },
  {
    id: 'bus_lissasfa_nations_unies',
    mode: 'bus',
    label: 'Bus · Lissasfa ↔ Place des Nations Unies',
    fareMad: 5,
    averageSpeedKmh: 17,
    headwayMinutes: 12,
    path: [
      [33.5298, -7.6528],
      [33.5435, -7.6299],
      [33.5561, -7.6105],
      [33.5657, -7.6008],
      [33.5734, -7.5897],
    ],
  },
  {
    id: 'bus_hay_hassani_ain_sebaa',
    mode: 'bus',
    label: 'Bus · Hay Hassani ↔ Aïn Sebaâ',
    fareMad: 5,
    averageSpeedKmh: 16,
    headwayMinutes: 14,
    path: [
      [33.5344, -7.6322],
      [33.5518, -7.6182],
      [33.5689, -7.6011],
      [33.5819, -7.5783],
      [33.5906, -7.5487],
      [33.6005, -7.5229],
    ],
  },
  {
    id: 'bus_sidi_moumen_oulfa',
    mode: 'bus',
    label: 'Bus · Sidi Moumen ↔ Oulfa',
    fareMad: 5,
    averageSpeedKmh: 15,
    headwayMinutes: 15,
    path: [
      [33.6055, -7.5263],
      [33.5927, -7.5531],
      [33.5798, -7.5764],
      [33.5653, -7.5962],
      [33.5508, -7.6161],
      [33.5364, -7.6357],
    ],
  },
];
