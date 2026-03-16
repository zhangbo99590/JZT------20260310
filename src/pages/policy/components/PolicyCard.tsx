import React, { useState } from "react";
import { Check, Pencil, Briefcase, Eye } from "lucide-react";

interface PolicyCardProps {
  data: any;
  onClick?: (id: number) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ data, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div
      className={`group relative py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-4 -mx-4 rounded-xl ${
        isEditing ? "edit-mode-active" : ""
      }`}
    >
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2 z-10">
        <button
          className={`p-2 bg-white shadow-md rounded-full transition-colors border border-slate-100 ${
            isEditing ? "text-green-600" : "text-slate-400 hover:text-blue-600"
          }`}
          onClick={toggleEdit}
          title={isEditing ? "保存" : "编辑政策"}
        >
          {isEditing ? <Check size={18} /> : <Pencil size={18} />}
        </button>
      </div>

      <div className="flex justify-between items-start mb-2 pr-12">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            {data.tags.map((tag: any, idx: number) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-[10px] rounded font-bold ${tag.color}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
          <h4
            className={`text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-relaxed ${
              isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : "cursor-pointer"
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onClick={() => !isEditing && onClick && onClick(data.id)}
          >
            {data.titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: data.titleHtml }} />
            ) : (
              data.title
            )}
          </h4>
        </div>
        <div className="flex flex-col items-end shrink-0 ml-4">
          <span
            className={`text-sm font-bold text-red-500 ${
              isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : ""
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning
          >
            {data.reward}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            发布日期: {data.date}
          </span>
        </div>
      </div>

      <p
        className={`text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 ${
          isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : ""
        }`}
        contentEditable={isEditing}
        suppressContentEditableWarning
      >
        {data.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center">
            <Briefcase size={14} className="mr-1" />
            适用行业:
            <span
              className={`ml-1 ${
                isEditing ? "cursor-text hover:bg-blue-50/50 px-1 rounded" : ""
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {data.industry}
            </span>
          </span>
          <span className="flex items-center">
            <Check size={14} className="mr-1" />
            已获批企业:
            <span
              className={`ml-1 ${
                isEditing ? "cursor-text hover:bg-blue-50/50 px-1 rounded" : ""
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {data.count}
            </span>
            家
          </span>
        </div>
        <button
          className="text-slate-400 text-sm font-bold flex items-center hover:text-blue-600 transition-colors"
          onClick={() => onClick && onClick(data.id)}
        >
          <Eye size={16} className="mr-1" />
          查看详情
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
