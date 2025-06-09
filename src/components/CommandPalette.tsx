
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Dialog, DialogContent } from "./ui/dialog";
import { Plus, Search, Save, Star, FileText, Edit, Settings, Keyboard } from "lucide-react";

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  group: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandAction[];
}

const CommandPalette = ({ open, onOpenChange, actions }: CommandPaletteProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.group]) {
      acc[action.group] = [];
    }
    acc[action.group].push(action);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  const handleSelect = (action: CommandAction) => {
    action.action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <Command className="border-none">
          <CommandInput 
            placeholder="Search for actions..." 
            value={search}
            onValueChange={setSearch}
            className="border-none focus:ring-0 text-base"
          />
          <CommandList className="max-h-96">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No actions found for "{search}"
            </CommandEmpty>
            
            {Object.entries(groupedActions).map(([group, groupActions]) => (
              <CommandGroup key={group} heading={group} className="px-2">
                {groupActions.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={() => handleSelect(action)}
                    className="flex items-center justify-between px-3 py-3 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-sm">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-gray-500">{action.description}</div>
                        )}
                      </div>
                    </div>
                    {action.shortcut && (
                      <kbd className="inline-flex items-center rounded border bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                        {action.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
