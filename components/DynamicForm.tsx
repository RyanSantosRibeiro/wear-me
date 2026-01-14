import React from 'react';
import { Plus, Trash2, Info, ChevronRight, ArrowLeft, GripVertical, Image as ImageIcon, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import { AssetPickerDialog } from '@/components/cms/AssetPickerDialog';
import ColorPicker from 'react-best-gradient-color-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DynamicFormProps {
  schema: any;
  data: any;
  onChange: (newData: any) => void;
  root?: boolean;
  slug?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ schema, data, onChange, root = true, slug }) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = React.useState(false);

  // Handle empty state initialization if data is undefined or null
  React.useEffect(() => {
    if (data === undefined || data === null) {
      if (schema.type === 'string') onChange('');
      else if (schema.type === 'number' || schema.type === 'integer') onChange(0);
      else if (schema.type === 'boolean') onChange(false);
      else if (schema.type === 'array') onChange([]);
      else if (schema.type === 'object') onChange({});
    }
  }, [data, schema.type, onChange]);

  if (data === undefined || data === null) return null;

  // Render Object
  if (schema.type === 'object' && schema.properties) {
    return (
      <div className={`space-y-4 ${root ? '' : 'pl-4 border-l-2 border-gray-100'}`}>
        {Object.entries(schema.properties).map(([key, propSchema]) => {
          const fieldSchema = propSchema as any;
          const isRequired = schema.required?.includes(key);
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {isRequired && <span className="text-red-500">*</span>}
                {fieldSchema.description && (
                  <div className="group relative">
                    <Info size={14} className="text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block z-10">
                      {fieldSchema.description}
                    </div>
                  </div>
                )}
              </label>
              <DynamicForm
                schema={fieldSchema}
                data={data[key]}
                onChange={(val) => onChange({ ...data, [key]: val })}
                root={false}
                slug={slug}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Render Array
  if (schema.type === 'array' && schema.items) {
    const items = Array.isArray(data) ? data : [];
    // Only use navigation if items are complex objects
    const isComplex = schema.items.type === 'object';

    // We can recycle focusedField state to store the index as a string
    const focusedIndex = focusedField ? parseInt(focusedField) : null;

    const addItem = () => {
      let initialVal: any = null;
      if (schema.items?.type === 'object') initialVal = {};
      else if (schema.items?.type === 'string') initialVal = "";
      else if (schema.items?.type === 'array') initialVal = [];

      onChange([...items, initialVal]);
      // Auto-focus new item if complex
      if (isComplex) setFocusedField(items.length.toString());
    };

    const removeItem = (index: number) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
      if (focusedIndex === index) setFocusedField(null);
    };

    const updateItem = (index: number, val: any) => {
      const newItems = [...items];
      newItems[index] = val;
      onChange(newItems);
    }

    // Detail View for Array Item
    if (isComplex && focusedIndex !== null && items[focusedIndex]) {
      return (
        <div className="space-y-4 animate-in slide-in-from-right duration-200">
          <button
            onClick={() => setFocusedField(null)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to List
          </button>

          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => { removeItem(focusedIndex); setFocusedField(null); }}
                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded"
                title="Delete this item"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Item {focusedIndex + 1}
            </h4>
            <DynamicForm
              schema={schema.items}
              data={items[focusedIndex]}
              onChange={(val) => updateItem(focusedIndex, val)}
              root={false}
              slug={slug}
            />
          </div>
        </div>
      );
    }

    // List View for Array
    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      if (sourceIndex === destinationIndex) return;

      const newItems = [...items];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(destinationIndex, 0, removed);
      onChange(newItems);
    };

    return (
      <div className="space-y-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId={`list-${Math.random()}`} isDropDisabled={false}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {items.map((item: any, idx: number) => {
                  // Use index as key for simplicity since we lack IDs.
                  // dnd requres string draggableId, so use `item-${idx}` but be aware of issues.
                  // Ideally we need stable IDs.

                  return (
                    <Draggable key={idx} draggableId={`item-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                        >
                          {/* For complex objects, show a clickable card */}
                          {isComplex ? (
                            <div
                              onClick={() => setFocusedField(idx.toString())}
                              className={`group flex items-center justify-between p-4 bg-white border rounded-lg cursor-pointer transition-all
                                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/50 rotate-1 border-primary z-50' : 'border-gray-200 hover:border-primary hover:shadow-sm'}
                                  `}
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
                                  <GripVertical size={16} />
                                </div>
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                                  {idx + 1}
                                </span>
                                <span className="font-medium text-gray-700">
                                  {(() => {
                                    const titleKey = Object.keys(item).find(k => k.toLowerCase().includes('title') || k.toLowerCase().includes('name') || k.toLowerCase().includes('label')) || Object.keys(item)[0];
                                    const previewTitle = item && typeof item === 'object' && titleKey ? item[titleKey] : `Item ${idx + 1}`;
                                    return typeof previewTitle === 'string' ? previewTitle : `Item ${idx + 1}`;
                                  })()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          ) : (
                            // For simple types, keep inline editing
                            <div className="relative p-2 border border-gray-200 rounded-lg bg-gray-50/50 flex items-center gap-2">
                              <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
                                <GripVertical size={16} />
                              </div>
                              <div className="flex-1">
                                <DynamicForm
                                  schema={schema.items as any}
                                  data={item}
                                  onChange={(val) => updateItem(idx, val)}
                                  root={false}
                                  slug={slug}
                                />
                              </div>
                              <button
                                onClick={() => removeItem(idx)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <button
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-sm font-medium flex justify-center items-center gap-2"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>
    );
  }

  // Render String
  if (schema.type === 'string') {
    if (schema.widget === 'image-uploader') {
      return (
        <div className="space-y-2">
          {data ? (
            <div className="relative w-full group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary transition-all">
              <img
                src={data}
                alt="Preview"
                className="w-full h-full object-contain cursor-pointer max-h-[200px]"
                onClick={() => setIsAssetPickerOpen(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <p className="text-white text-[10px] font-bold">CHANGE IMAGE</p>
              </div>
              <button
                onClick={() => onChange('')}
                className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAssetPickerOpen(true)}
              className="w-full max-w-[200px] aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
            >
              <ImageIcon size={24} className="mb-2 opacity-40" />
              <span className="text-xs font-medium">Select Image</span>
            </button>
          )}

          {slug && (
            <AssetPickerDialog
              slug={slug}
              open={isAssetPickerOpen}
              onOpenChange={setIsAssetPickerOpen}
              onSelect={(url) => onChange(url)}
            />
          )}
        </div>
      );
    }

    if (schema.widget === 'color-picker') {
      return (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-10 h-10 rounded-lg border border-gray-200 shrink-0 shadow-inner cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                style={{ backgroundColor: data || '#ffffff' }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <ColorPicker
                value={data || '#ffffff'}
                onChange={(val) => onChange(val)}
                hideControls={true}
                hidePresets={true}
                hideOpacity={true}
                width={220}
                height={180}
              />
            </PopoverContent>
          </Popover>
          <input
            type="text"
            value={data || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-mono"
            placeholder="#000000"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={data || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        placeholder={schema.description || 'Enter text...'}
      />
    );
  }

  // Render Number
  if (schema.type === 'number' || schema.type === 'integer') {
    return (
      <input
        type="number"
        value={data || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    );
  }

  // Render Boolean
  if (schema.type === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(!data)}
          className={`w-10 h-6 rounded-full p-1 transition-colors ${data ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${data ? 'translate-x-4' : ''}`} />
        </button>
        <span className="text-sm text-gray-600">{data ? 'Yes' : 'No'}</span>
      </div>
    );
  }

  return <div className="text-red-500 text-sm">Unsupported type: {schema.type}</div>;
};