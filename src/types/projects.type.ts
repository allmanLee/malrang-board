
import { type User } from './users.type';

export interface Project {
  _id?: ProjectId;
  name: string;
  teams: Team[];
  groupId: string;
  createUserId: string;
	isDeleted: boolean;
}

export interface Team {
  _id?: TeamId;
  name: string;
  members?: User[];
  createUserId: string;
  projectId: ProjectId;
	isDeleted: boolean;
  formTemplate?: FormTemplate;
}

export type ProjectId = string; // number | string;
export type TeamId = string; // number | string;

export type FormTemplate = {
  title: string;
  description: string;
  cols: FormTemplateCol[];
};

export type FormTemplateCol = {
  label: string;
  type: FormItemType;
  required: boolean;
  options: string[];
};

export type FormItemType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime' | 'file' | 'image' | 'video' | 'audio' | 'location' | 'map' | 'richtext' | 'markdown' | 'html' | 'url' | 'email' | 'tel' | 'color' | 'password' | 'hidden' | 'submit' | 'reset' | 'button' | 'fieldset' | 'legend' | 'label' | 'output' | 'progress' | 'meter' | 'datalist' | 'keygen' | 'command' | 'menu' | 'dialog' | 'details' | 'summary' | 'datagrid' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'optgroup' | 'select-one' | 'select-multiple' | 'textarea' | 'input' | 'button' | 'fieldset' | 'legend' | 'label' | 'output' | 'progress' | 'meter' | 'datalist' | 'keygen' | 'command' | 'menu' | 'dialog' | 'details' | 'summary' | 'datagrid' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'optgroup' | 'select-one' | 'select-multiple' | 'textarea' | 'input' | 'button' | 'fieldset' | 'legend' | 'label' | 'output' | 'progress' | 'meter' | 'datalist' | 'keygen' | 'command' | 'menu' | 'dialog' | 'details' | 'summary' | 'datagrid' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option' | 'optgroup' | 'select-one' | 'select-multiple' | 'textarea' | 'input' | 'button' | 'fieldset' | 'legend' | 'label' | 'output' | 'progress' | 'meter' | 'datalist' | 'keygen' | 'command' | 'menu' | 'dialog' | 'details' | 'summary' | 'datagrid' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'option'

