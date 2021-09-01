FROM nginx:1.12.1
ADD dist.tar /usr/share/nginx/html/
RUN cd /usr/share/nginx/html/dist/  && mv -f * ../
ADD nginx.conf /etc/nginx/
ADD default.conf /etc/nginx/conf.d/
ADD frontendShell.sh /usr/share/nginx/html/
RUN chmod +x /usr/share/nginx/html/frontendShell.sh
ADD dockerEnv.sh /usr/share/nginx/html/
RUN chmod +x /usr/share/nginx/html/dockerEnv.sh
WORKDIR /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["/usr/share/nginx/html/frontendShell.sh"]
#CMD ["nginx", "-g", "daemon off;"]

