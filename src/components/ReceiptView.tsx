import React from 'react';
import { LeaveRequest } from '../types';
import { Printer, X, CheckSquare, Square, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ReceiptViewProps {
  request: LeaveRequest;
  onClose: () => void;
  lang?: 'vi' | 'en';
  onApprove?: (supervisorName: string, signatureBase64: string) => void;
}

export default function ReceiptView({ request, onClose, lang = 'vi', onApprove }: ReceiptViewProps) {
  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [supervisorName, setSupervisorName] = React.useState('');
  const [supSignature, setSupSignature] = React.useState('');
  
  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Đã duyệt' : 'Approved'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <X className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Từ chối' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Chờ duyệt' : 'Pending'}
          </span>
        );
    }
  };

  // Helper render checkbox
  const renderCheckbox = (checked: boolean, labelEn: string, labelVi?: string) => {
    const displayLabel = lang === 'vi' ? (labelVi || labelEn) : labelEn;
    return (
      <div className="flex items-start gap-2.5 text-xs">
        {checked ? (
          <CheckSquare className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
        ) : (
          <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        )}
        <div>
          <span className="font-semibold text-gray-800">{displayLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col my-4 max-h-[90vh]">
        
        {/* Header - Non-Printable */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase">
                {request.id}
              </span>
              {getStatusBadge(request.status)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'vi' ? 'Quét từ: ' : 'Scanned from: '}
              <span className="font-medium text-gray-700">
                {request.qrStation || (lang === 'vi' ? "Không xác định" : "Unknown")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              {lang === 'vi' ? 'In phiếu' : 'Print Slip'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body - Printable */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 print:p-0 print:overflow-visible">
          
          <div className="border border-gray-300 p-6 rounded-lg bg-white print:border-none print:p-0">
            {/* Form Top Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {lang === 'vi' ? 'BÁO CÁO VẮNG MẶT CỦA NHÂN VIÊN' : 'EMPLOYEE ABSENCE REPORT'}
                </h2>
                <h3 className="text-xs text-gray-500 italic">
                  {lang === 'vi' ? 'EMPLOYEE ABSENCE REPORT' : 'BÁO CÁO VẮNG MẶT CỦA NHÂN VIÊN'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">To:</span>
                <span className="text-sm font-bold tracking-wider text-slate-800">
                  {lang === 'vi' ? 'PHÒNG NHÂN SỰ / PAYROLL' : 'PAYROLL / HR DEPARTMENT'}
                </span>
              </div>
            </div>

            {/* Employee Info Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg mb-6 border border-gray-200 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">
                  {lang === 'vi' ? 'Nhân viên (Employee)' : 'Employee'}
                </span>
                <span className="font-semibold text-gray-800">{request.employeeName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Work Email</span>
                <span className="font-semibold text-gray-800 font-mono truncate block" title={request.employeeEmail}>{request.employeeEmail || '————'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">
                  {lang === 'vi' ? 'Bộ phận / Xưởng' : 'Department'}
                </span>
                <span className="font-semibold text-gray-800">{request.department}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">
                  {lang === 'vi' ? 'Ngày lập đơn' : 'Date Created'}
                </span>
                <span className="font-semibold text-gray-800">
                  {new Date(request.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                </span>
              </div>
            </div>

            {/* Absence Timing Header Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
              {/* Option 1: Shall be absent */}
              <div className={`p-3 rounded-lg border ${request.absenceTiming === 'shall_be' ? 'border-slate-800 bg-slate-50/50' : 'border-gray-200 opacity-60'}`}>
                {renderCheckbox(request.absenceTiming === 'shall_be', "I shall be absent from the office", "Tôi sẽ vắng mặt (Tương lai)")}
                
                <div className="mt-4 space-y-2 pl-6 text-xs text-gray-700">
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Ngày nghỉ:' : 'Date/s:'}</span>
                    <span className="font-semibold text-gray-900">
                      {request.absenceTiming === 'shall_be' ? `${request.startDate} ~ ${request.endDate}` : '————'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Số ngày nghỉ:' : 'Number of days:'}</span>
                    <span className="font-semibold text-gray-900 font-mono">
                      {request.absenceTiming === 'shall_be' ? `${request.numDays} ${lang === 'vi' ? 'ngày' : 'day(s)'}` : '————'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Số giờ nghỉ:' : 'Number of hours:'}</span>
                    <span className="font-semibold text-gray-900 font-mono">
                      {request.absenceTiming === 'shall_be' ? `${request.numHours} ${lang === 'vi' ? 'giờ' : 'hour(s)'}` : '————'}
                    </span>
                  </div>
                  {request.absenceTiming === 'shall_be' && request.hourlyStartTime && (
                    <>
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                        <span>{lang === 'vi' ? 'Khung giờ nghỉ:' : 'Time window:'}</span>
                        <span className="font-semibold text-gray-900 font-mono">
                          {request.hourlyStartTime} ~ {request.hourlyEndTime}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                        <span>{lang === 'vi' ? 'Ca làm việc:' : 'Work Shift:'}</span>
                        <span className="font-semibold text-gray-900">
                          {request.hourlyShift || 'Khác'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Option 2: Have been absent */}
              <div className={`p-3 rounded-lg border ${request.absenceTiming === 'have_been' ? 'border-slate-800 bg-slate-50/50' : 'border-gray-200 opacity-60'}`}>
                {renderCheckbox(request.absenceTiming === 'have_been', "I have been absent from the office", "Tôi đã vắng mặt (Quá khứ)")}
                
                <div className="mt-4 space-y-2 pl-6 text-xs text-gray-700">
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Ngày nghỉ:' : 'Date/s:'}</span>
                    <span className="font-semibold text-gray-900">
                      {request.absenceTiming === 'have_been' ? `${request.startDate} ~ ${request.endDate}` : '————'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Số ngày nghỉ:' : 'Number of days:'}</span>
                    <span className="font-semibold text-gray-900 font-mono">
                      {request.absenceTiming === 'have_been' ? `${request.numDays} ${lang === 'vi' ? 'ngày' : 'day(s)'}` : '————'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                    <span>{lang === 'vi' ? 'Số giờ nghỉ:' : 'Number of hours:'}</span>
                    <span className="font-semibold text-gray-900 font-mono">
                      {request.absenceTiming === 'have_been' ? `${request.numHours} ${lang === 'vi' ? 'giờ' : 'hour(s)'}` : '————'}
                    </span>
                  </div>
                  {request.absenceTiming === 'have_been' && request.hourlyStartTime && (
                    <>
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                        <span>{lang === 'vi' ? 'Khung giờ nghỉ:' : 'Time window:'}</span>
                        <span className="font-semibold text-gray-900 font-mono">
                          {request.hourlyStartTime} ~ {request.hourlyEndTime}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                        <span>{lang === 'vi' ? 'Ca làm việc:' : 'Work Shift:'}</span>
                        <span className="font-semibold text-gray-900">
                          {request.hourlyShift || 'Khác'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Leave Reasons Grid */}
            <div className="py-6 border-b border-gray-200">
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                {lang === 'vi' ? 'LÝ DO VẮNG MẶT / REASON FOR ABSENCE' : 'REASON FOR ABSENCE / LÝ DO VẮNG MẶT'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCheckbox(
                  request.reasons.sickSelf, 
                  "*Sick Leave - Self", 
                  "Nghỉ ốm - Bản thân"
                )}
                {renderCheckbox(
                  request.reasons.sickFamily, 
                  "*Sick Leave - Family Member", 
                  "Nghỉ ốm - Chăm sóc người nhà"
                )}
                
                <div className="md:col-span-2 pl-6">
                  {renderCheckbox(
                    request.reasons.fmlaCfra,
                    "Employee believes this absence may qualify for Family and Medical Leave (FMLA) or California Family Rights Act (CFRA) leave",
                    "Người lao động tin rằng sự vắng mặt này có thể đủ điều kiện nghỉ theo Luật FMLA hoặc Đạo luật Quyền gia đình CFRA"
                  )}
                </div>

                {renderCheckbox(
                  request.reasons.vacationPto, 
                  "Vacation / PTO", 
                  "Nghỉ phép thường niên / Nghỉ có lương"
                )}
                {renderCheckbox(
                  request.reasons.childCare, 
                  "School/child care activity or emergency**", 
                  "Hoạt động trường học/chăm sóc con nhỏ hoặc khẩn cấp**"
                )}

                {renderCheckbox(
                  request.reasons.juryDuty, 
                  "Jury Duty (attach summons)", 
                  "Nghĩa vụ bồi thẩm đoàn (đính kèm lệnh triệu tập)"
                )}
                {renderCheckbox(
                  request.reasons.bereavement, 
                  "Bereavement", 
                  "Nghỉ hiếu (tang chế)"
                )}

                {request.reasons.bereavement && (
                  <div className="md:col-span-2 pl-6 pb-2 border-l-2 border-slate-300 italic text-xs text-gray-600">
                    {lang === 'vi' ? 'Quan hệ với người quá cố:' : 'Relationship to deceased:'}{' '}
                    <span className="font-semibold text-gray-900 border-b border-gray-400 px-2">
                      {request.bereavementRelation || (lang === 'vi' ? 'Chưa điền' : 'Not provided')}
                    </span>
                  </div>
                )}

                <div className="md:col-span-2">
                  {renderCheckbox(
                    request.reasons.other, 
                    "Other (explain):", 
                    "Lý do khác (vui lòng giải thích)"
                  )}
                  {request.reasons.other && (
                    <div className="mt-2 pl-6 pr-4 py-2 border-l-2 border-slate-300 text-xs bg-gray-50 rounded italic text-gray-700">
                      {request.otherExplanation || (lang === 'vi' ? 'Chưa có giải trình' : 'No explanation provided')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footnote matching paper exactly */}
            <div className="py-4 text-[10px] text-gray-500 leading-relaxed border-b border-gray-100">
              {lang === 'vi' ? (
                <p>
                  <span className="font-semibold">*Nghỉ bệnh</span> bao gồm nghỉ phép cho bạn hoặc người thân để chăm sóc phòng ngừa hoặc điều trị tình trạng sức khỏe hiện tại hoặc vì mục đích cụ thể nếu bạn là nạn nhân của tội phạm hoặc ngược đãi, bao gồm bạo lực gia đình, tấn công tình dục, rình rập hoặc các tội phạm khác gây tổn thương thể chất hoặc tinh thần. Người thân bao gồm cha mẹ, cha mẹ kế/cha mẹ chồng/vợ, con cái, vợ/chồng, bạn đời đăng ký hợp pháp, ông bà, cháu và anh chị em ruột.
                </p>
              ) : (
                <p>
                  <span className="font-semibold">*Sick leave</span> includes leave for you or a family member for preventive care or care of an existing health condition or for specified purposes if you are a victim of crime or abuse, including domestic violence, sexual assault, stalking or other crime that causes physical or mental injury. Family members include the employee's parent, parent-in-law, child, spouse, registered domestic partner, grandparent, grandchild and sibling.
                </p>
              )}
            </div>

            {/* Signatures Panel */}
            <div className="grid grid-cols-2 gap-6 pt-6 text-xs">
              {/* Employee Signature */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 uppercase text-[9px]">
                    {lang === 'vi' ? 'Chữ ký Nhân viên' : "Employee's Signature"}
                  </p>
                  <div className="border-b border-gray-300 h-16 flex items-end justify-center pb-1 relative">
                    {request.employeeSignature ? (
                      <img 
                        src={request.employeeSignature} 
                        alt="Employee Signature" 
                        className="max-h-14 object-contain mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-serif italic text-sm text-slate-700 tracking-wider pb-1">
                        {request.employeeName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">{lang === 'vi' ? 'Ngày ký:' : 'Date signed:'}</span>
                  <span className="font-semibold text-gray-900 font-mono">
                    {request.employeeSignatureDate || '————'}
                  </span>
                </div>
              </div>

              {/* Supervisor Signature */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 uppercase text-[9px]">
                    {lang === 'vi' ? 'Chữ ký Giám sát / Trưởng nhóm' : "Supervisor's Signature"}
                  </p>
                  <div className="border-b border-gray-300 h-16 flex items-end justify-center pb-1 relative">
                    {request.supervisorSignature ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={request.supervisorSignature} 
                          alt="Supervisor Signature" 
                          className="max-h-12 object-contain mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                        {request.supervisorName && (
                          <span className="text-[9px] text-gray-500 -mt-1 font-semibold">{request.supervisorName}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 italic text-[10px]">
                        {lang === 'vi' ? 'Chờ quản lý duyệt' : 'Awaiting review'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">{lang === 'vi' ? 'Ngày ký:' : 'Date signed:'}</span>
                  <span className="font-semibold text-gray-900 font-mono">
                    {request.supervisorSignatureDate || '————'}
                  </span>
                </div>
              </div>
            </div>

            {/* Attachments Section if they exist */}
            {request.attachments && request.attachments.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs print:hidden">
                <p className="font-semibold text-gray-800 mb-2">
                  {lang === 'vi' ? 'Tài liệu đính kèm:' : 'Supporting Attachments:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Supervisor Quick Action box inside detail, if it's pending and we have an approve action available */}
          {request.status === 'pending' && onApprove && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
              <div className="space-y-1">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
                  {lang === 'vi' ? 'Bạn là Quản lý / Giám sát trực tiếp?' : 'Are you the Leader/Manager?'}
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {lang === 'vi' 
                    ? 'Đơn nghỉ phép này đang chờ phê duyệt từ bạn. Bạn có thể ký duyệt nhanh tại đây.' 
                    : 'This leave request is currently pending. You can sign and approve it right here.'}
                </p>
              </div>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all text-center self-start sm:self-center shrink-0"
              >
                {lang === 'vi' ? 'Ký phê duyệt' : 'Approve & Sign'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simple Approval Modal within receipt */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowApproveModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {lang === 'vi' ? 'Ký phê duyệt của Quản lý' : 'Supervisor Leave Approval'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (onApprove && supervisorName && supSignature) {
                onApprove(supervisorName, supSignature);
                setShowApproveModal(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {lang === 'vi' ? 'Tên Giám sát / Quản lý' : 'Supervisor Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  placeholder={lang === 'vi' ? 'Ví dụ: Lê Mạnh Hùng (Tổ trưởng)' : 'e.g. John Smith (Supervisor)'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {lang === 'vi' ? 'Vẽ chữ ký của bạn' : 'Draw Your Signature'} <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  {/* Drawing Area */}
                  <SignatureDrawArea onSave={(dataUrl) => setSupSignature(dataUrl)} lang={lang} />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                >
                  {lang === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!supervisorName || !supSignature}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-all shadow-sm"
                >
                  {lang === 'vi' ? 'Duyệt và ký đơn' : 'Approve and Sign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Mini Signature Pad for Supervisor for code encapsulation and fast loading
function SignatureDrawArea({ onSave, lang = 'vi' }: { onSave: (dataUrl: string) => void; lang?: 'vi' | 'en' }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasDrawn, setHasDrawn] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Deep blue
    ctx.lineWidth = 2;
  }, []);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={380}
        height={150}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
        className="w-full h-[150px] bg-white cursor-crosshair block"
      />
      {!hasDrawn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-xs italic">
          {lang === 'vi' ? 'Vẽ chữ ký của bạn vào đây' : 'Draw your signature here'}
        </div>
      )}
      {hasDrawn && (
        <button
          type="button"
          onClick={clear}
          className="absolute bottom-2 right-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-600 rounded font-semibold border border-gray-200"
        >
          {lang === 'vi' ? 'Xóa lại' : 'Clear'}
        </button>
      )}
    </div>
  );
}
