import { RBACModule, RBACAction } from '@/types';
import { Can } from '@/lib/Can';
import { useAbility } from '@casl/react';
import { AbilityContext } from '@/lib/Can';

export default function RBACExample() {
  const ability = useAbility(AbilityContext);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">RBAC Examples with CASL</h1>

      {/* Ví dụ 1: Sử dụng Can component */}
      <Can I={RBACAction.CREATE} a={RBACModule.MOVIES}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Tạo phim mới
        </button>
      </Can>

      {/* Ví dụ 2: Với fallback */}
      <Can 
        I={RBACAction.DELETE} 
        a={RBACModule.MOVIES}
        not
      >
        <p className="text-red-500">Bạn không có quyền xóa phim</p>
      </Can>

      {/* Ví dụ 3: Sử dụng ability hook trực tiếp */}
      {ability.can(RBACAction.CREATE, RBACModule.ROOMS) && (
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Tạo phòng xem
        </button>
      )}

      {/* Ví dụ 4: Kiểm tra manage (toàn quyền) */}
      {ability.can(RBACAction.MANAGE, RBACModule.USERS) && (
        <div className="p-4 bg-purple-100 rounded">
          <h2>Admin Panel - Quản lý Users</h2>
        </div>
      )}

      {/* Ví dụ 5: Multiple permissions */}
      <div className="space-x-2">
        <Can I={RBACAction.READ} a={RBACModule.MOVIES}>
          <button className="px-4 py-2 bg-gray-500 text-white rounded">
            Xem danh sách phim
          </button>
        </Can>

        <Can I={RBACAction.UPDATE} a={RBACModule.MOVIES}>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded">
            Sửa phim
          </button>
        </Can>

        <Can I={RBACAction.DELETE} a={RBACModule.MOVIES}>
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            Xóa phim
          </button>
        </Can>
      </div>

      {/* Ví dụ 6: Kiểm tra trong logic */}
      <div className="p-4 border rounded">
        <h3 className="font-bold">Quyền của bạn:</h3>
        <ul className="list-disc list-inside">
          {ability.can(RBACAction.CREATE, RBACModule.MOVIES) && (
            <li>Tạo phim</li>
          )}
          {ability.can(RBACAction.READ, RBACModule.MOVIES) && (
            <li>Xem phim</li>
          )}
          {ability.can(RBACAction.UPDATE, RBACModule.MOVIES) && (
            <li>Cập nhật phim</li>
          )}
          {ability.can(RBACAction.DELETE, RBACModule.MOVIES) && (
            <li>Xóa phim</li>
          )}
          {ability.can(RBACAction.MANAGE, RBACModule.MOVIES) && (
            <li className="text-red-500 font-bold">Toàn quyền quản lý phim</li>
          )}
        </ul>
      </div>
    </div>
  );
}
