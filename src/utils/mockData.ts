import { LeaveRequest, WorkshopStation } from '../types';

export const WORKSHOP_STATIONS: WorkshopStation[] = [
  {
    id: 'station-1',
    name: 'Tổ Lắp ráp Động cơ 1 - Xưởng Cơ khí',
    code: 'QR-MECH-ASSY1',
    location: 'Khu A, Tầng 1'
  },
  {
    id: 'station-2',
    name: 'Trạm Ép khuôn nhựa 3 - Xưởng Đúc',
    code: 'QR-PLAS-MOLD3',
    location: 'Khu B, Tầng hầm'
  },
  {
    id: 'station-3',
    name: 'Phòng Cắt vải công nghiệp - Xưởng May',
    code: 'QR-TEXT-CUTTING',
    location: 'Khu C, Tầng 2'
  },
  {
    id: 'station-4',
    name: 'Khu Đóng gói thành phẩm - Xưởng Logistics',
    code: 'QR-LOG-PACK1',
    location: 'Kho trung tâm, Cổng số 4'
  }
];

// Simple generated transparent tiny images as placeholders for signature base64 so we don't need real drawings
const MOCK_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: 'REQ-202606-001',
    employeeName: 'Nguyễn Văn Minh',
    employeeId: 'EMP-9082',
    employeeEmail: 'minh.nguyen@factory.com',
    department: 'Xưởng Cơ khí',
    absenceTiming: 'have_been',
    startDate: '2026-06-22',
    endDate: '2026-06-23',
    numDays: 2,
    numHours: 16,
    reasons: {
      sickSelf: true,
      sickFamily: false,
      fmlaCfra: false,
      vacationPto: false,
      childCare: false,
      juryDuty: false,
      bereavement: false,
      other: false
    },
    attachments: [],
    employeeSignature: MOCK_SIGNATURE,
    employeeSignatureDate: '2026-06-23',
    supervisorSignature: MOCK_SIGNATURE,
    supervisorSignatureDate: '2026-06-24',
    supervisorName: 'Trần Hữu Nam (Quản đốc)',
    status: 'approved',
    createdAt: '2026-06-23T08:30:00Z',
    qrStation: 'Tổ Lắp ráp Động cơ 1 - Xưởng Cơ khí'
  },
  {
    id: 'REQ-202606-002',
    employeeName: 'Lê Thị Mai',
    employeeId: 'EMP-7364',
    employeeEmail: 'mai.le@factory.com',
    department: 'Xưởng May',
    absenceTiming: 'shall_be',
    startDate: '2026-06-26',
    endDate: '2026-06-26',
    numDays: 1,
    numHours: 8,
    reasons: {
      sickSelf: false,
      sickFamily: false,
      fmlaCfra: false,
      vacationPto: true,
      childCare: false,
      juryDuty: false,
      bereavement: false,
      other: false
    },
    attachments: [],
    employeeSignature: MOCK_SIGNATURE,
    employeeSignatureDate: '2026-06-24',
    status: 'pending',
    createdAt: '2026-06-24T14:15:00Z',
    qrStation: 'Phòng Cắt vải công nghiệp - Xưởng May'
  },
  {
    id: 'REQ-202606-003',
    employeeName: 'Phạm Đức Hoàng',
    employeeId: 'EMP-2940',
    employeeEmail: 'hoang.pham@factory.com',
    department: 'Xưởng Đúc',
    absenceTiming: 'shall_be',
    startDate: '2026-07-02',
    endDate: '2026-07-05',
    numDays: 3,
    numHours: 24,
    reasons: {
      sickSelf: false,
      sickFamily: false,
      fmlaCfra: false,
      vacationPto: false,
      childCare: false,
      juryDuty: false,
      bereavement: false,
      other: true
    },
    otherExplanation: 'Nghỉ giải quyết việc riêng gia đình ở quê (sửa nhà cho bố mẹ)',
    attachments: [],
    employeeSignature: MOCK_SIGNATURE,
    employeeSignatureDate: '2026-06-24',
    status: 'pending',
    createdAt: '2026-06-24T10:05:00Z',
    qrStation: 'Trạm Ép khuôn nhựa 3 - Xưởng Đúc'
  }
];
