/**
 * Module 15: Inventory & Asset Control
 * Stock management for Madinah Mushafs, study guides, wooden Rehal stands,
 * and classroom furniture with automated reorder warnings.
 */

import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Search,
  BookOpen,
  X,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { InventoryItem } from '../../types';

interface InventoryModuleProps {
  state: AppStoreState;
  onUpdateInventoryQty: (id: string, delta: number) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  state,
  onUpdateInventoryQty,
  onAddInventoryItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<any>('Madinah Mushaf');
  const [qty, setQty] = useState<number>(50);
  const [minThreshold, setMinThreshold] = useState<number>(20);
  const [unitPriceETB, setUnitPriceETB] = useState<number>(370);
  const [location, setLocation] = useState('Library Shelf A1');

  const filteredInventory = state.inventory.filter(i =>
    i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.storageLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAssetValueETB = state.inventory.reduce((acc, i) => acc + i.quantityInStock * i.unitPriceETB, 0);
  const lowStockItems = state.inventory.filter(i => i.quantityInStock <= i.minimumThreshold);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      itemName: itemName.trim(),
      category,
      quantityInStock: qty,
      minimumThreshold: minThreshold,
      unitPriceETB,
      storageLocation: location.trim(),
      condition: 'Pristine',
    };

    onAddInventoryItem(newItem);
    setIsAddModalOpen(false);
    setItemName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Madinah Mushaf & Asset Inventory</h1>
            <span className="font-arabic text-amber-300 text-lg">إدارة المصاحፍ والعهدة</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stock control for King Fahd Complex 15-line Uthmani Mushafs, Tajweed texts, wooden Rehal stands, and classroom furniture.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Procure New Asset</span>
        </button>
      </div>

      {/* Aggregate Asset Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Stocked Asset Valuation</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {totalAssetValueETB.toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all storage shelves & classrooms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Low Stock Warnings</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockItems.length} Items Below Threshold
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Automatic reorder replenishment triggered</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Catalog Items</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {state.inventory.length} Categories
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Madinah Mushafs, Stands & Resources</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assets by name, category, or storage location..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Item & Classification</th>
              <th className="py-3 px-4 font-semibold">Storage Location</th>
              <th className="py-3 px-4 font-semibold text-center">Unit Cost (ETB)</th>
              <th className="py-3 px-4 font-semibold text-center">Stock Level</th>
              <th className="py-3 px-4 font-semibold text-center">Threshold Alert</th>
              <th className="py-3 px-4 font-semibold text-right">Quick Stock Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredInventory.map(item => {
              const isLow = item.quantityInStock <= item.minimumThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{item.itemName}</div>
                    <div className="text-[10px] text-slate-400">{item.category} · Condition: {item.condition}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.storageLocation}</td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-amber-300">
                    {item.unitPriceETB.toLocaleString()} ETB
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-base text-white">
                      {item.quantityInStock}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">Units</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low (Min {item.minimumThreshold})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Optimal</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onUpdateInventoryQty(item.id, -1)}
                        className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                        title="Issue / Decrement 1 Unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onUpdateInventoryQty(item.id, 1)}
                        className="w-7 h-7 rounded bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors"
                        title="Restock / Increment 1 Unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Inventory Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Procure New Asset / Mushaf Batch</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Title / Description:</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="e.g. 15-Line Madinah Mushaf (Large Print)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Madinah Mushaf">Madinah Mushaf</option>
                    <option value="Tajweed Text">Tajweed Text</option>
                    <option value="Wooden Rehal (Qur'an Stand)">Wooden Rehal (Qur'an Stand)</option>
                    <option value="Classroom Furniture">Classroom Furniture</option>
                    <option value="Audio/Tech Equipment">Audio/Tech Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Storage Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Qty:</label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={e => setQty(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Min Alert Qty:</label>
                  <input
                    type="number"
                    min={1}
                    value={minThreshold}
                    onChange={e => setMinThreshold(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Cost (ETB):</label>
                  <input
                    type="number"
                    min={0}
                    value={unitPriceETB}
                    onChange={e => setUnitPriceETB(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Commit Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
