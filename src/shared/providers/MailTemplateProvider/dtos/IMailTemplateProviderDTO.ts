interface IVariables {
  [key: string]: string;
}

export default interface IMailTemplateProviderDTO {
  variables: IVariables;
  templateFile: string;
}
