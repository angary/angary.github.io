set -e
rm -rf out && yarn build && \
if [ ! -d out ]; then
  npx next export
fi && \
if [ ! -d out ]; then
  echo "Error: export output directory 'out' was not created."
  exit 1
fi && \
cat CNAME > out/CNAME && \
cd out && touch .nojekyll &&
git init && git add . && \
git commit -m "Initial commit" && \
git remote add origin git@github.com:angary/angary.github.io.git && \
git push --force origin master:gh-pages
