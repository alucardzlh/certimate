import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { produce } from "immer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDeployEditContext } from "./DeployEdit";

const DeployToSSH = () => {
  const { t } = useTranslation();

  const { deploy: data, setDeploy, error, setError } = useDeployEditContext();

  useEffect(() => {
    if (!data.id) {
      setDeploy({
        ...data,
        config: {
          certPath: "/etc/nginx/ssl/nginx.crt",
          keyPath: "/etc/nginx/ssl/nginx.key",
          preCommand: "",
          command: "sudo service nginx reload",
        },
      });
    }
  }, []);

  useEffect(() => {
    setError({});
  }, []);

  const formSchema = z.object({
    certPath: z.string().min(1, t("domain.deployment.form.file_cert_path.placeholder")),
    keyPath: z.string().min(1, t("domain.deployment.form.file_key_path.placeholder")),
    preCommand: z.string().optional(),
    command: z.string().optional(),
  });

  useEffect(() => {
    const res = formSchema.safeParse(data.config);
    if (!res.success) {
      setError({
        ...error,
        certPath: res.error.errors.find((e) => e.path[0] === "certPath")?.message,
        keyPath: res.error.errors.find((e) => e.path[0] === "keyPath")?.message,
        preCommand: res.error.errors.find((e) => e.path[0] === "preCommand")?.message,
        command: res.error.errors.find((e) => e.path[0] === "command")?.message,
      });
    } else {
      setError({
        ...error,
        certPath: undefined,
        keyPath: undefined,
        preCommand: undefined,
        command: undefined,
      });
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col space-y-8">
        <div>
          <Label>{t("domain.deployment.form.file_cert_path.label")}</Label>
          <Input
            placeholder={t("domain.deployment.form.file_cert_path.label")}
            className="w-full mt-1"
            value={data?.config?.certPath}
            onChange={(e) => {
              const newData = produce(data, (draft) => {
                draft.config ??= {};
                draft.config.certPath = e.target.value?.trim();
              });
              setDeploy(newData);
            }}
          />
          <div className="text-red-600 text-sm mt-1">{error?.certPath}</div>
        </div>

        <div>
          <Label>{t("domain.deployment.form.file_key_path.label")}</Label>
          <Input
            placeholder={t("domain.deployment.form.file_key_path.placeholder")}
            className="w-full mt-1"
            value={data?.config?.keyPath}
            onChange={(e) => {
              const newData = produce(data, (draft) => {
                draft.config ??= {};
                draft.config.keyPath = e.target.value?.trim();
              });
              setDeploy(newData);
            }}
          />
          <div className="text-red-600 text-sm mt-1">{error?.keyPath}</div>
        </div>

        <div>
          <Label>{t("domain.deployment.form.shell_pre_command.label")}</Label>
          <Textarea
            className="mt-1"
            value={data?.config?.preCommand}
            placeholder={t("domain.deployment.form.shell_pre_command.placeholder")}
            onChange={(e) => {
              const newData = produce(data, (draft) => {
                draft.config ??= {};
                draft.config.preCommand = e.target.value;
              });
              setDeploy(newData);
            }}
          ></Textarea>
          <div className="text-red-600 text-sm mt-1">{error?.preCommand}</div>
        </div>

        <div>
          <Label>{t("domain.deployment.form.shell_command.label")}</Label>
          <Textarea
            className="mt-1"
            value={data?.config?.command}
            placeholder={t("domain.deployment.form.shell_command.placeholder")}
            onChange={(e) => {
              const newData = produce(data, (draft) => {
                draft.config ??= {};
                draft.config.command = e.target.value;
              });
              setDeploy(newData);
            }}
          ></Textarea>
          <div className="text-red-600 text-sm mt-1">{error?.command}</div>
        </div>
      </div>
    </>
  );
};

export default DeployToSSH;
